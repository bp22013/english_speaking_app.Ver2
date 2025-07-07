/* トレーニング関連API統合ファイル */

import { Hono } from 'hono';
import { getTrainingWords } from './getTrainingWords';
import { submitTrainingResult } from './submitTrainingResult';
import { getReviewWords } from './getReviewWords';
import { getStudentStatistics } from './getStudentStatistics';

const trainingApp = new Hono()
    .route('/', getTrainingWords)
    .route('/', submitTrainingResult)
    .route('/', getReviewWords)
    .route('/', getStudentStatistics);

export default trainingApp;
