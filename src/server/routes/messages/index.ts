/* メッセージのAPIを統合するファイル */

import { Hono } from 'hono';
import { sendMessageFromAdmin } from './sendMessageFromAdmin';

const messageApp = new Hono().route('/', sendMessageFromAdmin);

export default messageApp;
