import { Hono } from 'hono';
import { studentLogin } from './StudentLogin';
import { studentRegister } from './StudentRegister';
import { sessionCheck } from './sessionCheck';
import { getAllStudents } from './getAllStudent';

const authApp = new Hono()
    .route('/', studentLogin)
    .route('/', studentRegister)
    .route('/', sessionCheck)
    .route('/', getAllStudents);

export default authApp;
