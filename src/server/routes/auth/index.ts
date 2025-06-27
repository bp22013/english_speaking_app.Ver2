import { Hono } from 'hono';
import { studentLogin } from './StudentLogin';
import { studentRegister } from './StudentRegister';
import { sessionCheck } from './sessionCheck';
import { getAllStudents } from './getAllStudent';
import { DeleteStudent } from './DeleteStudent';
import { studentLogout } from './StudentLogout';

const authApp = new Hono()
    .route('/', studentLogin)
    .route('/', studentRegister)
    .route('/', sessionCheck)
    .route('/', getAllStudents)
    .route('/', DeleteStudent)
    .route('/', studentLogout);

export default authApp;
