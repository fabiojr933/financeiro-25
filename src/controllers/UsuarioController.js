const usuario = require('../models/Usuario');
const validaCampos = require('../library/validaCampos');
const bcrypt = require('bcrypt');

exports.Index = async (req, res) => {
  try {
    const dados = await usuario.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('usuario/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('usuario/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  res.render('usuario/novo');
};
exports.Editar = async (req, res) => {
  try {
    const data = await usuario.UsuarioId(req.params.id, req.session.empresa.id_empresa);
    res.render('usuario/editar', { data });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/usuario/index');
  }
}

exports.Salvar = async (req, res) => {
  try {
    if (!validaCampos(req, res, '/usuario/novo', 'nome', 'email', 'senha')) return;
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(req.body.senha, saltRounds);

    const dados = { nome: req.body.nome, ativo: req.body.ativo, email: req.body.email, senha: senhaHash, id_empresa: req.session.empresa.id_empresa };
    await usuario.Salvar(dados);
    req.flash('info', 'Usuário salvo com sucesso!');
    res.redirect('/usuario/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/usuario/novo');
  }
};

exports.Update = async (req, res) => {
  try {
    if (!validaCampos(req, res, '/usuario/novo', 'nome', 'email', 'senha')) return;
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(req.body.senha, saltRounds);

    const dados = { nome: req.body.nome, ativo: req.body.ativo, email: req.body.email, senha: senhaHash };
    await usuario.Update(dados, req.body.id, req.body.id_empresa);
    req.flash('info', 'Usuário atualizado com sucesso!');
    res.redirect('/usuario/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/usuario/index');
  }
};
exports.Delete = async (req, res) => {
  try {
    await usuario.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Usuario deletado com sucesso!');
    res.redirect('/usuario/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/usuario/index');
  }
};



