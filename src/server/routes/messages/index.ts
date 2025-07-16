/* メッセージのAPIを統合するファイル */

import { Hono } from 'hono';
import { sendMessageFromAdmin } from './sendMessageFromAdmin';
import { deleteMessage } from './deleteMessage';
import { updateMessage } from './updateMessage';
import { getAdminMessages } from './getAdminMessages';
import { getStudentMessages } from './getAdminMessageForStudent';

const messageApp = new Hono()
    .route('/', sendMessageFromAdmin)
    .route('/', deleteMessage)
    .route('/', updateMessage)
    .route('/', getAdminMessages)
    .route('/', getStudentMessages);

export default messageApp;
