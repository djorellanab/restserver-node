// ==============================
// Port
// ==============================
process.env.PORT =  process.env.PORT || 3000;

// ==============================
// Entorno
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV  || 'dev';

// ==============================
// Base de datos
// ==============================
let urlDB;

if(process.env.NODE_ENV === 'dev')
{
    urlDB = 'mongodb://localhost:27017/cafe';
}
else
{
    urlDB = 'mongodb://cafe-admin:51247105D!ego@ds253831.mlab.com:53831/cafe';
}

process.env.URLDB = urlDB;

// ==============================
// Vencimiento del token
// ==============================
// 60 seg * 60 min * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ==============================
// SEED
// ==============================
process.env.SEED = process.env.SEED  || 'este-es-el-seed-desarrollo';

// ==============================
// GOOGLE CLIENT ID
// ==============================
process.env.CLIENT_ID =  process.env.CLIENT_ID || "200175793697-a12ng8dq6rn34donn11hf9a9ih5p6b0k.apps.googleusercontent.com";

// ==============================
// Pagineo
// ==============================
process.env.DESDE = 0;
process.env.LIMITE = 5;