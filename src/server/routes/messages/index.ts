/* メッセージのAPIを統合するファイル */

import { Hono } from 'hono';
import { sendMessageFromAdmin } from './sendMessageFromAdmin';
import { getAdminMessages } from './getAdminMessages';
import { deleteMessage } from './deleteMessage';
import { updateMessage } from './updateMessage';

const messageApp = new Hono()
    .route('/', sendMessageFromAdmin)
    .route('/', getAdminMessages)
    .route('/', deleteMessage)
    .route('/', updateMessage);

export default messageApp;
