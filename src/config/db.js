import mysql from 'mysql2/promise';
import { env } from './env.js';


export const db = mysql.createPool({
    host: Number( env.db.host),
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});