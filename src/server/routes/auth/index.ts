/* 認証機能統合用API */

import { Hono } from 'hono';
import { studentLogin } from './StudentLogin';
import { studentRegister } from './StudentRegister';
import { sessionCheck } from './sessionCheck';
import { getAllStudents } from './getAllStudent';
import { getAdminSession } from './getAdminSession';
import { DeleteStudent } from './DeleteStudent';
import { studentLogout } from './StudentLogout';
import { hookSession } from './getStudentSession';
import { changeStudentPassword } from './changeStudentPassword';
import { updateStudentProfile } from './updateStudentProfile';
import { updateAdminProfile } from './AdminProfileUpdate';
import { updateAdminPassword } from './AdminPasswordChange';
import { dataExport } from './DataExport';

const authApp = new Hono()
    .route('/', studentLogin)
    .route('/', studentRegister)
    .route('/', sessionCheck)
    .route('/', getAllStudents)
    .route('/', DeleteStudent)
    .route('/', studentLogout)
    .route('/', hookSession)
    .route('/', changeStudentPassword)
    .route('/', updateStudentProfile)
    .route('/', updateAdminProfile)
    .route('/', updateAdminPassword)
    .route('/', getAdminSession)
    .route('/', dataExport);

export default authApp;
