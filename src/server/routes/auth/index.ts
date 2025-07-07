/* 認証機能統合用API */

import { Hono } from 'hono';
import { studentLogin } from './StudentLogin';
import { studentRegister } from './StudentRegister';
import { sessionCheck } from './sessionCheck';
import { getAllStudents } from './getAllStudent';
import { DeleteStudent } from './DeleteStudent';
import { studentLogout } from './StudentLogout';
import { hookSession } from './useHookSession';
import { updateStudent } from './StudentUpdate';
import { changeStudentPassword } from './changeStudentPassword';
import { updateStudentProfile } from './updateStudentProfile';

const authApp = new Hono()
    .route('/', studentLogin)
    .route('/', studentRegister)
    .route('/', sessionCheck)
    .route('/', getAllStudents)
    .route('/', DeleteStudent)
    .route('/', studentLogout)
    .route('/', hookSession)
    .route('/', updateStudent)
    .route('/', changeStudentPassword)
    .route('/', updateStudentProfile);

export default authApp;
