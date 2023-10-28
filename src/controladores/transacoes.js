let banco = require('../bancodedados');
const {format} = require('date-fns');

const deposito = async (req, res) => {
    const {numeroConta, valor} = req.body;

    try {
        if (valor <= 0) {
            return res.status(401).json({mensagem: 'Só serão aceitos valores acima de zero.'});
        };

        const conta = banco.contas.find(conta => conta.numero === numeroConta);
        conta.saldo += valor;
        const data = new Date();
        const deposito = {
            data: format(data, 'yyyy-MM-dd H:mm:ss'),
            numero_conta,
            valor
        };

        banco.depositos.push(deposito);
        res.status(201).send();

    } catch (erro) {
        return res.status(500).json(erro.message)
    };
};

const saque = async (req, res) => {
    const {numeroConta, valor, senha} = req.body;

    try {
        const conta = banco.contas.find(conta => conta.numero === numeroConta);
        if (!senha) {
            return res.status(400).json({mensagem: 'O campo senha é obrigatório.'});
        };

        if (senha !== conta.usuario.senha) {
            return res.status(401).json({mensagem: 'A senha informada está incorreta.'})
        };

        if (conta.saldo < valor) {
            return res.status(403).json({mensagem: 'Saldo insuficiente.'})
        };

        conta.saldo -= valor;
        const data = new Date();
        const saque = {
            data: format(data, 'yyyy-MM-dd H:mm:ss'),
            numeroConta,
            valor
        };

        banco.saques.push(saque);
        res.status(201).send();

    } catch (erro) {
        return res.status(500).json(erro.message);
    };
};

const transferencia = async (req, res) => {
    const {numeroContaOrigem, numeroContaDestino, valor, senha} = req.body;

    if (!numeroContaOrigem) {
        return res.status(400).json({mensagem: 'Informe a conta de origem.'});
    };

    if (!numeroContaDestino) {
        return res.status(400).json({mensagem: 'Informe a conta de destino.'});
    };

    if (!valor) {
        return res.status(400).json({mensagem: 'Informe o valor a ser transferido.'});
    };

    if (valor <= 0) {
        return res.status(401).json({mensagem: 'Só serão aceitos valores acima de zero.'});
    };

    if (!senha) {
        return res.status(400).json({mensagem: "A senha é obrigatória!" });
    };

    try {
        const contaOrigem = banco.contas.find(conta => conta.numero === numeroContaOrigem);
        const contaDestino = banco.contas.find(conta => conta.numero === numeroContaDestino);

        if (!contaOrigem) {
            return res.status(404).json({mensagem: 'Conta origem inexistente.'});
        };

        if (!contaDestino) {
            return res.status(404).json({mensagem: 'Conta destino inexistente.'});
        };

        if (senha !== contaOrigem.usuario.senha) {
            return res.status(401).json({mensagem: 'A senha informada está incorreta.'});
        };

        if (contaOrigem.saldo < valor) {
            return res.status(403).json({mensagem: 'Saldo insuficiente.'});
        };

        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;
        const data = new Date();
        const transferencia = {
            data: format(data, 'yyyy-MM-dd HH:mm:ss'),
            numero_conta_origem,
            numero_conta_destino,
            valor
        };

        banco.transferencias.push(transferencia);
        res.status(201).send();

    } catch (erro) {
        return res.status(500).json(erro.message);
    };
};

module.exports = {
    deposito,
    saque,
    transferencia
};