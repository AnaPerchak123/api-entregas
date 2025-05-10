// API Entregas - com filtro

const express = require("express");
const app = express();
const PORT = 3001; // Porta diferente

app.use(express.json());

let entregas = [];

// Cadastrar nova entrega
app.post("/entregas", (req, res) => {
  const { nome_cliente, endereco_entrega, status, data_entrega, motoboy } = req.body;

  if (!nome_cliente || !endereco_entrega || !status || !data_entrega || !motoboy) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  entregas.push({ nome_cliente, endereco_entrega, status, data_entrega, motoboy });
  res.status(201).json({ mensagem: "Entrega cadastrada com sucesso!" });
});

// Listar todas as entregas
app.get("/entregas", (req, res) => {
  res.json(entregas);
});

// Consulta com dois filtros: status e motoboy
app.get("/entregas/filtro", (req, res) => {
  const { status, motoboy } = req.query;

  const resultado = entregas.filter(e =>
    (!status || e.status.toLowerCase() === status.toLowerCase()) &&
    (!motoboy || e.motoboy.toLowerCase() === motoboy.toLowerCase())
  );

  res.json(resultado);
});

app.listen(PORT, () => {
  console.log(`API de entregas com filtro rodando em http://localhost:${PORT}`);
});
