/* 単語全般機能統合用API */

import { Hono } from 'hono';
import { RegisterWords } from './registerWords';
import { GetWords } from './getWords';
import { deleteWord } from './deleteWords';

const wordApp = new Hono().route('/', RegisterWords).route('/', GetWords).route('/', deleteWord);

export default wordApp;
