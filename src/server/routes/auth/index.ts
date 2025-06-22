import { Hono } from 'hono';
import studentLogin from './StudentLogin';
import { studentRegister } from './StudentRegister';

const authApp = new Hono().route('/', studentLogin).route('/', studentRegister);

export default authApp;
