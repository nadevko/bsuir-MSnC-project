// server/api/me.get.ts
import db from "../utils/db";
import type { User } from "../utils/types";
import { getUserIdFromToken } from "../utils/auth";
import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
    const userId = await getUserIdFromToken(event); // важно: await
    if (!userId) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const user = (await db
        .prepare(
            "SELECT id, username, email, birthdate, createdAt FROM users WHERE id = ?"
        )
        .get(userId)) as User | undefined;

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        birthdate: user.birthdate,
        createdAt: user.createdAt,
    };
});
