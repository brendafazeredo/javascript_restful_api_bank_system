let banco = require('../bancodedados');

const saldo = async (req, res) => {
    const {numeroConta, senha} = req.query;
    try {
        const conta = banco.contas.find(conta => conta.numero === numeroConta);
        res.json({saldo: conta.saldo});

    } catch (erro) {
        return res.status(500).json(erro.message);
    };
};

const extrato = async (req, res) => {
    const {numeroConta} = req.query;

    try {
        const despositos = banco.depositos.filter(dep => dep.numero_conta === numeroConta);
        const saques = banco.saques.filter(saque => saque.numero_conta === numeroConta);
        const transferenciasEnviadas = banco.transferencias.filter(transf => transf.numero_conta_origem === numeroConta);
        const transferenciasRecebidas = banco.transferencias.filter(transf => transf.numero_conta_destino === numeroConta);

        const extrato = {
            despositos,
            saques,
            transferenciasEnviadas,
            transferenciasRecebidas
        };

        res.json(extrato);
        
    } catch (erro) {
        return res.status(500).json(erro.message);
    };
};

module.exports = {
    saldo,
    extrato
};