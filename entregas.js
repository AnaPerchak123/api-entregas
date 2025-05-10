// Entregas JS

const readline = require('readline');
const db = require('./database'); // Conexão com o MySQL

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function exibirMenu() {
  console.log("\n--- MENU DE ENTREGAS ---");
  console.log("1. Adicionar nova entrega");
  console.log("2. Listar entregas");
  console.log("3. Sair");

  rl.question("Escolha uma opção: ", resposta => {
    switch (resposta) {
      case "1":
        adicionarEntrega();
        break;
      case "2":
        listarEntregas();
        exibirMenu();
        break;
      case "3":
        console.log("Encerrando...");
        rl.close();
        break;
      default:
        console.log("Opção inválida.");
        exibirMenu();
    }
  });
}

function adicionarEntrega() {
  rl.question("Nome do cliente: ", nome_cliente => {
    rl.question("Endereço de entrega: ", endereco_entrega => {
      rl.question("Status (pendente/entregue): ", status => {
        rl.question("Data da entrega (yyyy-mm-dd): ", data_entrega => {
          rl.question("Nome do motoboy: ", motoboy => {
            const sql = `
              INSERT INTO entregas (nome_cliente, endereco_entrega, status, data_entrega, motoboy)
              VALUES (?, ?, ?, ?, ?)
            `;
            const params = [nome_cliente, endereco_entrega, status, data_entrega, motoboy];

            db.execute(sql, params, (err, results) => {
              if (err) {
                console.log("Erro ao adicionar entrega:", err);
                exibirMenu();
                return;
              }
              console.log("Entrega adicionada com sucesso!");
              exibirMenu();
            });
          });
        });
      });
    });
  });
}

function listarEntregas() {
  console.log("\n--- LISTA DE ENTREGAS ---");
  db.query("SELECT * FROM entregas", (err, rows) => {
    if (err) {
      console.log("Erro ao listar entregas:", err);
      return;
    }
    if (rows.length === 0) {
      console.log("Nenhuma entrega cadastrada.");
    } else {
      rows.forEach((e, i) => {
        console.log(`${i + 1}. Cliente: ${e.nome_cliente}, Endereço: ${e.endereco_entrega}`);
        console.log(`   Status: ${e.status}, Data: ${e.data_entrega}, Motoboy: ${e.motoboy}`);
      });
    }
    exibirMenu();
  });
}

exibirMenu();

