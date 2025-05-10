const express = require('express');
const app = express();
const db = require('./database'); // Conexão com o banco de dados MySQL
const PORT = 3000;

app.use(express.json());

// Conectar ao banco de dados
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }

  console.log('Conectado ao banco de dados MySQL!');

  // POST - Cadastrar nova entrega
  app.post("/entregas", (req, res) => {
    const { nome_cliente, endereco_entrega, status, data_entrega, motoboy } = req.body;

    if (!nome_cliente || !endereco_entrega || !status || !data_entrega || !motoboy) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const sql = `
      INSERT INTO entregas (nome_cliente, endereco_entrega, status, data_entrega, motoboy)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [nome_cliente, endereco_entrega, status, data_entrega, motoboy];

    db.execute(sql, params, (err, results) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao cadastrar entrega" });
      }
      res.status(201).json({ mensagem: "Entrega cadastrada com sucesso!", id: results.insertId });
    });
  });

  // GET - Listar todas as entregas
  app.get("/entregas", (req, res) => {
    db.query("SELECT * FROM entregas", (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao buscar entregas" });
      }
      res.json(rows);
    });
  });

  // GET - Filtro por nome_cliente e status
  app.get("/entregas/filtro", (req, res) => {
    const { nome_cliente, status } = req.query;

    let sql = "SELECT * FROM entregas WHERE 1=1";
    let params = [];

    if (nome_cliente) {
      sql += " AND LOWER(nome_cliente) = LOWER(?)";
      params.push(nome_cliente);
    }

    if (status) {
      sql += " AND LOWER(status) = LOWER(?)";
      params.push(status);
    }

    db.query(sql, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao buscar com filtros" });
      }
      res.json(rows);
    });
  });

  // PUT - Atualizar entrega por ID
  app.put("/entregas/:id", (req, res) => {
    const { id } = req.params;
    const { nome_cliente, endereco_entrega, status, data_entrega, motoboy } = req.body;

    if (!nome_cliente || !endereco_entrega || !status || !data_entrega || !motoboy) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const sql = `
      UPDATE entregas
      SET nome_cliente = ?, endereco_entrega = ?, status = ?, data_entrega = ?, motoboy = ?
      WHERE id = ?
    `;
    const params = [nome_cliente, endereco_entrega, status, data_entrega, motoboy, id];

    db.execute(sql, params, (err, results) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao atualizar entrega" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Entrega não encontrada" });
      }

      res.json({ mensagem: "Entrega atualizada com sucesso!" });
    });
  });

  // DELETE - Remover entrega por ID
  app.delete("/entregas/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM entregas WHERE id = ?";

    db.execute(sql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao deletar entrega" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Entrega não encontrada" });
      }

      res.json({ mensagem: "Entrega deletada com sucesso!" });
    });
  });

  // Iniciar o servidor
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
});
