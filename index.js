const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
const port = 3000
app.use(express.json())
const { BodyBuilder } = require('./src/bodybuilder/bodybuilder.entity')
const { Gym } = require('./src/gym/gym.entity')
const { Style } = require('./src/style/style.entity')

//banco de dados de clientes
var clientes = []

//banco de dados de academias
var academias = [
  {id: 0, nome: 'Gym 1', telefone: '123456789', bodyBuilder:[]},
  {id: 1, nome: 'Gym 2', telefone: '987654321', bodyBuilder:[]},
  {id: 2, nome: 'Gym 3', telefone: '555555555', bodyBuilder:[]},
]

var styles = []

app.post('/body-builder', (req, res) => {
  const data = req.body;
  const idacademia = data.idacademia;
  const gym = academias.find(academia => academia.id == idacademia);
  const idestilo = data.idestilo;
  const estilo = styles.find(style => style.id == idestilo);
  console.log(estilo);
  let bodyBuilder = new BodyBuilder(
    data.nome, 
    data.cpf, 
    data.peso, 
    data.altura, 
    data.dataNascimento, 
    data.sapato, 
    data.dataBeijo, 
    data.piriquito, 
    gym,
    estilo);
  clientes.push(bodyBuilder);
  console.log(clientes);
  res.status(201).json(clientes);  // Retorna a lista atualizada de clientes
});

app.put('/body-builder/:cpf', (req, res) => {
  const data = req.body;
  let cpf = req.params.cpf;
  const idacademia = data.idacademia;
  const gym = academias.find(academia => academia.id == idacademia);
  const idestilo = data.idestilo;
  const estilo = styles.find(style => style.id == idestilo);
  let bodyBuilder = new BodyBuilder(
    data.nome, 
    data.cpf, 
    data.peso, 
    data.altura, 
    data.dataNascimento, 
    data.sapato, 
    data.dataBeijo, 
    data.piriquito,
    gym,
    estilo);
  
  for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].cpf == cpf) {
          clientes[i] = bodyBuilder;
          return res.status(200).json(clientes);  // Retorna a lista atualizada de clientes
      }
  }
  res.status(404).send("Body builder não encontrado");
});

app.put('/body-builder/:cpf', (req, res) => {
  const data = req.body
  let bodyBuilder = new BodyBuilder(data.nome, data.cpf, data.peso, data.altura, data.dataNascimento, data.sapato, data.dataBeijo, data.piriquito) //receber o bodyBuilder, que é um objeto JSON que vem do front-end
  let cpf = req.params.cpf
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i]
    if (cliente.cpf == cpf) {
      clientes[i] = bodyBuilder
      //substitui o bodyBuilder pelos dados enviados no body
      res.send("Atualizou")
    }
  }
  throw new Error("Body builder nao encontrado")
})

app.delete('/body-builder/:cpf', (req, res) => {
  let cpf = req.params.cpf
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i]
    if (cliente.cpf == cpf) {
      clientes.splice(i, 1)
      res.send("Deletou")
    }
  }
  throw new Error("Cliente nao encontrado")
})

app.get('/body-builder', (req, res) => {
  res.json(clientes)
})


app.get('/bodybuilder/search/:texto', (req, res) => {
  let texto = req.params.texto;

  let retorno = [];
  let clienteEncontrado = false;

  // Função para buscar recursivamente dentro de objetos
  function verificarObjeto(objeto, texto) {
    for (let [chave, valor] of Object.entries(objeto)) {
      console.log(`chave: ${chave}, valor: ${valor}`);
      if (typeof valor === 'string' && valor.toLowerCase().includes(texto.toLowerCase())) {
        console.log(`Encontrado "${texto}" na chave: ${chave}, valor: ${valor}`);
        return true;
      } else if (typeof valor === 'object' && valor !== null) {
        // Chamada recursiva para objetos aninhados
        if (verificarObjeto(valor, texto)) {
          return true;
        }
      }
    }
    return false;
  }

  // Busca nos clientes
  clientes.forEach((element, index) => {
    if (verificarObjeto(element, texto)) {
      console.log(`Encontrado "${texto}" no objeto de índice ${index}`);
      retorno.push(element);
      clienteEncontrado = true;
    }
  });

  // Retorna os resultados
  if (clienteEncontrado) {
    console.log(retorno);
    res.json(retorno);
  } else {
    res.status(404).json({ mensagem: 'Nenhum cliente encontrado.' }); // Alterado para retornar uma resposta com status 404
  }
});

app.post('/gym', (req, res) => {
  const data = req.body
  let gym = new Gym();
  gym.nome = data.nome
  gym.telefone = data.telefone
  academias.push(gym);
  res.send("Cadastrou")

})

app.get('/gym', (req, res) => {
  res.json(academias)
})

app.post('/style', (req, res) => {
  const data = req.body; // Obtém os dados enviados no corpo da requisição
  console.log(data);

  // Criação do estilo
  let style = new Style();
  style.id = styles.length ? styles[styles.length - 1].id + 1 : 0; // Atribui um ID único
  style.nome = data.nome; // Atribui o nome do estilo

  // Adiciona o estilo ao array
  styles.push(style);

  console.log(styles); // Verifica os estilos no console
  res.status(201).send("Cadastrado com sucesso"); // Resposta indicando sucesso
});

app.get('/style', (req, res) => {
  res.json(styles)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

