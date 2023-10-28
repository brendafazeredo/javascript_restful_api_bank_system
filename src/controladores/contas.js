let banco = require('../bancodedados');

let numeroConta = 1;

const listarContas = async (req, res) => {
    const {senhaBanco} = req.query;

    if (!senhaBanco) {
        return res.status(400).json({mensagem: 'A senha precisa ser informada.'});
    };

    if (senhaBanco !== banco.banco.senha) {
        return res.status(401).json({mensagem: 'A senha informada é inválida.'});
    };

    return res.json(banco.contas);
};

const criarContas = async (req, res) => {
    const {nome, cpf, dataNascimento, telefone, email, senha} = req.body;

    try {
        if (banco.contas.length > 0) {
            maiorNumero = banco.contas.reduce((acc, cur) => {
                return Number(acc.numero) > Number(cur.numero) ? acc : cur;
            });

            numeroConta = Number(maiorNumero.numero) + 1;
        };

        contaNovoUsuario = {
            numero: numeroConta.toString(),
            saldo: 0,
            usuario: {
                nome,
                cpf,
                dataNascimento,
                telefone,
                email,
                senha
            }
        };

        banco.contas.push(contaNovoUsuario);

        return res.status(204).send();

    } catch (erro) {
        return res.status(500).json(erro.message);
    };

};

const atualizarConta = async (req, res) => {
    const {nome, cpf, dataNascimento, telefone, email, senha} = req.body;
    const numeroConta = req.params.numeroConta;

    try {
        const contaASerAtualizada = banco.contas.find(conta => conta.numero === numeroConta);
        const contasDiferentesDaEscolhida = banco.contas.filter(conta => conta !== contaASerAtualizada)
        const verificarCpfRepetido = contasDiferentesDaEscolhida.some(conta => conta.usuario.cpf === cpf);
        const verificarEmailRepetido = contasDiferentesDaEscolhida.some(conta => conta.usuario.email === email);

        if (verificarCpfRepetido) {
            return res.status(400).json({mensagem: 'Já existe uma conta com o CPF informado.'});
        };

        if (verificarEmailRepetido) {
            return res.status(400).json({mensagem: 'Já existe uma conta com o e-mail informado.'});
        };

        contaASerAtualizada.usuario.nome = nome;
        contaASerAtualizada.usuario.cpf = cpf;
        contaASerAtualizada.usuario.dataNascimento = dataNascimento;
        contaASerAtualizada.usuario.telefone = telefone;
        contaASerAtualizada.usuario.email = email;
        contaASerAtualizada.usuario.senha = senha;

        return res.status(201).send();

    } catch (erro) {
        return res.status(500).json(erro.message);
    };
};

const deletarConta = async (req, res) => {
    const numeroConta = req.params.numeroConta;

    try {
        const contaASerDeletada = banco.contas.find(conta => conta.numero === numeroConta);

        if (!contaASerDeletada) {
            return res.status(404).json({mensagem: 'Conta não encontrada.'});
        };

        if (contaASerDeletada.saldo > 0) {
            return res.status(401).json({mensagem: 'A conta só pode ser deletada se não tiver saldo.'});
        };

        const indexConta = banco.contas.findIndex(conta => conta === contaASerDeletada);

        banco.contas.splice(indexConta, 1);

        return res.status(200).json({mensagem: 'Conta deletada com sucesso.'});

    } catch (erro) {
        return res.status(500).json(erro.message);
    };
};

module.exports = {
    listarContas,
    criarContas,
    atualizarConta,
    deletarConta
};