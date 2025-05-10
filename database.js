const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306, 
  user: 'root',
  password: '123456',
  database: 'entregas'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

module.exports = db;
