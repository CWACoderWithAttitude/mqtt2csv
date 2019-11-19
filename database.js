// https://dev.to/miku86/nodejs-postgresql-orm-overview-3mcn
const Sequelize = require('sequelize');
// your credentials
const db_user='postgres';
const db_pwd='postgres';
const db_name='weather';

DATABASE_URL = 'postgres://'+db_user+':'+db_pwd+'@127.0.0.1:5432/'+db_name;

const database = new Sequelize(DATABASE_URL);

module.exports = database;

