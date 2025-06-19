import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/server/db';
import { students } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
    providers: [
        Credentials({
            name: 'Student Login',
            credentials: {
                studentId: { label: 'Student ID', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;

                const [student] = await db
                    .select()
                    .from(students)
                    .where(eq(students.studentId, credentials.studentId))
                    .limit(1);

                if (student && (await bcrypt.compare(credentials.password, student.passwordHash))) {
                    return {
                        id: student.id,
                        name: student.name,
                        studentId: student.studentId,
                        role: 'student',
                    };
                }

                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.studentId = user.studentId;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.studentId = token.studentId;
                session.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login', // 任意でログイン画面指定
    },
});
export { handler as GET, handler as POST };
