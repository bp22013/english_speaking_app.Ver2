import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/server/db';
import { sessions, users } from '@/server/db/schema';

export const lucia = new Lucia(new DrizzlePostgreSQLAdapter(db, sessions, users), {
    sessionCookie: {
        name: 'session',
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production',
        },
    },
    getUserAttributes: (data) => {
        return {
            studentId: data.studentId,
            name: data.name,
        };
    },
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            studentId: string;
            name: string;
        };
    }
}
