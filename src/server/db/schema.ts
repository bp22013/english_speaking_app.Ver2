/* データベースのスキーマ */

import { pgTable, text, integer, real, timestamp, boolean } from 'drizzle-orm/pg-core';

// 学生テーブル
export const students = pgTable('students', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id').unique().notNull(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull(),
    grade: text('grade'),
    registeredAt: timestamp('registered_at', { withTimezone: true }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

// 単語テーブル
export const words = pgTable('words', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    word: text('word').notNull(),
    meaning: text('meaning'),
    level: integer('level'),
    addedAt: timestamp('added_at', { withTimezone: true }),
});

// 単語回答履歴
export const studentWordStatus = pgTable('student_word_status', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id')
        .references(() => students.studentId)
        .notNull(),
    wordId: text('word_id')
        .references(() => words.id)
        .notNull(),
    isCorrect: boolean('is_correct'),
    answeredAt: timestamp('answered_at', { withTimezone: true }),
    answeredFlag: boolean('answered_flag'),
});

// 学習統計
export const studentStatistics = pgTable('student_statistics', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    studentId: text('student_id')
        .references(() => students.studentId)
        .notNull(),
    totalStudyTime: integer('total_study_time'),
    weeklyStudyTime: integer('weekly_study_time'),
    accuracyRate: real('accuracy_rate'),
    todayWordsLearned: integer('today_words_learned'),
    consecutiveDays: integer('consecutive_days'),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
});

// 管理者
export const admins = pgTable('admins', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    registeredAt: timestamp('registered_at', { withTimezone: true }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    lastPasswordChangeAt: timestamp('last_password_change_at', { withTimezone: true }),
});

// 管理者からのメッセージ
export const messages = pgTable('messages', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),

    studentId: text('student_id')
        .references(() => students.studentId)
        .notNull(),

    senderId: text('sender_id').notNull(),

    messageType: text('message_type'),
    messagePriority: text('message_priority'),
    content: text('content'),
    isRead: boolean('is_read'),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
});

// 管理者メッセージ（返信や通知履歴）
export const adminMessages = pgTable('admin_messages', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    adminId: text('admin_id').notNull(),
    studentId: text('student_id')
        .references(() => students.studentId)
        .notNull(),
    content: text('content'),
    sentAt: timestamp('sent_at', { withTimezone: true }),
});

// lucia認証用テーブル（生徒側）
export const users = pgTable('user', {
    id: text('id').primaryKey(),
    studentId: text('student_id').unique().notNull(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull(),
    image: text('image'),
});

// 生徒側のセッションテーブル
export const sessions = pgTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
});
