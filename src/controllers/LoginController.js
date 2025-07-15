const loginModel = require('../models/Login');
const empresaModel = require('../models/Empresa');
const usuarioModel = require('../models/Usuario');
const modeloModel = require('../models/ModelosPadrao');
const validaCampos = require('../library/validaCampos');
const bcrypt = require('bcrypt');

exports.Login = async (req, res) => {
  res.render('login/index');
};

exports.Cadastrar = async (req, res) => {
  res.render('login/cadastrar');
};

exports.CadastrarEmpresa = async (req, res) => {
  try {
    if (!validaCampos(req, res, '/cadastrar', 'nome', 'email', 'senha')) return;

    const empresa = { nome: req.body.nome, email: req.body.email, instance: req.body.nome_empresa, ativo: 'S' };
    const id_empresa = await empresaModel.Salvar(empresa);

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(req.body.senha, saltRounds);

    const usuario = { nome: req.body.nome, email: req.body.email, senha: senhaHash, ativo: 'S', id_empresa: id_empresa.id };
    const id_usuario = await usuarioModel.Salvar(usuario);
    const id_despesa = await modeloModel.InserirDespesaFixa(id_usuario.id, id_empresa.id);
    const id_despesa_v = await modeloModel.InserirDespesaVaricavel(id_usuario.id, id_empresa.id);

    await modeloModel.InserirReceita(id_usuario.id, id_empresa.id);
    await modeloModel.InserirReserva_financeira(id_usuario.id, id_empresa.id);
    await modeloModel.InserirSubDespesaFixa(id_usuario.id, id_empresa.id, id_despesa.id);
    await modeloModel.InserirSubDespesaVariavel(id_usuario.id, id_empresa.id, id_despesa_v.id);
    await modeloModel.ClientePadraoInsert(id_usuario.id, id_empresa.id);
    await modeloModel.FornecedorPadraoInsert(id_usuario.id, id_empresa.id);
    await modeloModel.InserirFormaPagamento(id_usuario.id, id_empresa.id);

    req.flash('info', 'Usuário Cadastrado com sucesso!');
    res.redirect('/');

  } catch (error) {
    console.log(error.message);
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/cadastrar');
  }
};

exports.logoff = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.Autenticar = async (req, res) => {
  try {
    const resultado = await loginModel.Login(req.body);
    if (resultado.error) {
      req.flash('info', resultado.error || 'Usuário ou senha incorretos');
      return res.redirect('/');
    }
    const user = resultado.user;
    console.log(user);
    req.session.empresa = user;
    req.flash('info', `Bem-vindo(a), ${user.nome}`);
    return res.redirect('/dashboard');

  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    return res.redirect('/');
  }
};
