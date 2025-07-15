const cliente = require('../models/Cliente');
const validaCampos = require('../library/validaCampos');


exports.Index = async (req, res) => {
  try {
    const dados = await cliente.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('cliente/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('cliente/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  res.render('cliente/novo');
};
exports.Editar = async (req, res) => {
  try {
    const data = await cliente.ClienteId(req.params.id, req.session.empresa.id_empresa);
    res.render('cliente/editar', { data });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/cliente/index');
  }
}

exports.Salvar = async (req, res) => {
  if (!validaCampos(req, res, 'nome')) return;

  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status, id_usuario: req.session.empresa.id, id_empresa: req.session.empresa.id_empresa };
    await cliente.Salvar(dados);
    req.flash('info', 'Cliente salvo com sucesso!');
    res.redirect('/cliente/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/cliente/novo');
  }
};

exports.Update = async (req, res) => {
  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status };
    await cliente.Update(dados, req.body.id, req.body.id_empresa);
    req.flash('info', 'Cliente atualizado com sucesso!');
    res.redirect('/cliente/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/cliente/index');
  }
};

exports.Delete = async (req, res) => {
  try {
    await cliente.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Cliente deletado com sucesso!');
    res.redirect('/cliente/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/cliente/index');
  }
};


