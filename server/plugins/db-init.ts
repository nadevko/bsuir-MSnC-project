import { initDatabase } from "../utils/db.init";

export default defineNitroPlugin(async () => {
  await initDatabase();
});
