const express =  require('express');
const {listarContas, criarContas, atualizarConta, deletarConta} = require('./controladores/contas');
const {verificarDadosUsuario, verificarNumeroDeConta, verificarDadosUsuarioRepetidos, verificarContaEValor, verificarContaESenha} = require('./intermediarios');
const {deposito, saque, transferencia} = require('./controladores/transacoes');
const {saldo, extrato} = require('./controladores/saldoextrato');

const rotas = express();

rotas.get('/contas', listarContas);
rotas.get('/contas/saldo', verificarContaESenha, saldo);
rotas.get('/contas/extrato', verificarContaESenha, extrato);

rotas.post('/contas', verificarDadosUsuario,verificarDadosUsuarioRepetidos, criarContas);
rotas.post('/transacoes/depositar', verificarContaEValor, deposito);
rotas.post('/transacoes/sacar', verificarContaEValor, saque);
rotas.post('/transacoes/transferir', transferencia);

rotas.put('/contas/:numeroConta/usuario', verificarNumeroDeConta, verificarDadosUsuario, atualizarConta);

rotas.delete('/contas/:numeroConta', verificarNumeroDeConta, deletarConta);

module.exports = rotas;