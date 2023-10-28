let banco = require('./bancodedados');

const verificarDadosUsuario = async (req, res, next) => {
    const {nome, cpf, dataNascimento, telefone, email, senha} = req.body;

    try {
        if (!nome || !cpf || !dataNascimento || !telefone || !email || !senha) {
            return res.status(400).json({mensagem: 'Todos os campos são obrigatórios.'});
        };

        next();

    } catch (erro) {
        return res.status(500).json(erro.message);
    };
};

const verificarDadosUsuarioRepetidos = async (req, res, next) => {
    const {cpf, email} = req.body;
    let cpfUnico = true;
    let emailUnico = true;

    try {
        if (banco.contas.length > 0) {
            cpfUnico = banco.contas.every(conta => conta.usuario.cpf !== cpf);
            emailUnico = banco.contas.every(conta => conta.usuario.email !== email);
        };

        if (!cpfUnico) {
            return res.status(400).json({mensagem: 'Já existe uma conta com o CPF informado.'});

        } if (!emailUnico) {
            return res.status(400).json({mensagem: 'Já existe uma conta com o e-mail informado.'});
        };

        next();

    } catch (erro) {
        return res.status(500).json(erro.message);
    };
};

const verificarNumeroDeConta = async (req, res, next) => {
    const numeroConta = req.params.numeroConta;
    let conta = null;

    if (banco.contas.length > 0) {
        conta = banco.contas.find(conta => conta.numero === numeroConta);
    };

    if (!conta) {
        return res.status(400).json({mensagem: 'Número de conta inválido.'});
    };

    next();
};

const verificarContaEValor = async (req, res, next) => {
    const {numeroConta, valor} = req.body;

    if (!numeroConta || !valor) {
        return res.status(400).json({mensagem: 'O número da conta e o valor são requisitos obrigatórios.'});
    };

    let conta = null;

    if (banco.contas.length > 0) {
        conta = banco.contas.find(conta => conta.numero === numeroConta);
    };

    if (!conta) {
        return res.status(400).json({mensagem: 'Número de conta inválido.'});
    };

    next();
};

const verificarContaESenha = async (req, res, next) =>{
    const {numeroConta, senha} = req.query;

    if (!numeroConta) {
        return res.status(400).json({mensagem: 'Informe o número da conta para prosseguir.'});
    };

    if (!senha) {
        return res.status(400).json({mensagem: 'Informe a senha da conta para prosseguir.'});
    };

    const conta = banco.contas.find(conta=> conta.numero === numeroConta);

    if (!conta) {
        return res.status(400).json({mensagem: 'Conta não encontrada.'});
    };

    if (conta.usuario.senha !== senha){
        return res.status(400).json({mensagem: 'Senha incorreta.'});
    };

    next();
};

module.exports = {
    verificarDadosUsuario,
    verificarNumeroDeConta,
    verificarDadosUsuarioRepetidos,
    verificarContaEValor,
    verificarContaESenha
};