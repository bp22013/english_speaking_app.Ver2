/* メッセージのAPIを統合するファイル */

import { Hono } from 'hono';
import { sendMessageFromAdmin } from './sendMessageFromAdmin';
import { deleteMessage } from './deleteMessage';
import { updateMessage } from './updateMessage';
import { getAdminMessages } from './getAdminMessages';

const messageApp = new Hono()
    .route('/', sendMessageFromAdmin)
    .route('/', deleteMessage)
    .route('/', updateMessage)
    .route('/', getAdminMessages);

export default messageApp;
