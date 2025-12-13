const isProduction = process.env.NODE_ENV === "production";

/**
 * Мы реализуем "ленивую" инициализацию адаптера:
 * - adapter будет создан при первом вызове prepare()
 * - init() выполняет динамические импорты без top-level await
 */
let adapter: DbAdapter | null = null;
let initPromise: Promise<void> | null = null;

async function initAdapter(): Promise<void> {
  if (adapter) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (isProduction) {
      const { neon } = await import("@neondatabase/serverless");
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error("DATABASE_URL is not set");
      }

      const sql = neon(databaseUrl);

      adapter = {
        prepare: (query: string) => ({
          run: async (...params: any[]) => {
            await sql.query(query, params);
          },
          get: async (...params: any[]) => {
            const rows = await sql.query(query, params);
            return rows[0] ?? undefined;
          },
          all: async (...params: any[]) => {
            return await sql.query(query, params);
          },
        }),
      };
    } else {
      const Database = (await import("better-sqlite3")).default;
      const { join } = await import("path");

      const sqlite = new Database(join(process.cwd(), "data.sqlite"));

      try {
        sqlite.pragma("journal_mode = WAL");
      } catch {}

      adapter = {
        prepare: (query: string) => {
          const stmt = sqlite.prepare(query);
          return {
            run: async (...params: any[]) => stmt.run(...params),
            get: async (...params: any[]) => stmt.get(...params),
            all: async (...params: any[]) => stmt.all(...params),
          };
        },
        pragma: (p: string) => {
          void (async () => {
            try {
              sqlite.pragma(p);
            } catch {
              /* ignore */
            }
          })();
        },
      };
    }
  })();

  return initPromise;
}

/**
 * Публичный прокси-адаптер: методы подготавливают выполнение,
 * ждут инициализацию (если нужно) и делегируют реальному адаптеру.
 */
const db: DbAdapter = {
  prepare(query: string) {
    return {
      run: async (...params: any[]) => {
        await initAdapter();

        return adapter!.prepare(query).run(...params);
      },
      get: async (...params: any[]) => {
        await initAdapter();

        return adapter!.prepare(query).get(...params);
      },
      all: async (...params: any[]) => {
        await initAdapter();

        return adapter!.prepare(query).all(...params);
      },
    };
  },
  pragma(p: string) {
    if (adapter && adapter.pragma) {
      return adapter.pragma(p);
    }

    void initAdapter().then(() => {
      if (adapter && adapter.pragma) {
        adapter.pragma(p) as Promise<void> | void;
      }
    });
  },
};

export default db;
