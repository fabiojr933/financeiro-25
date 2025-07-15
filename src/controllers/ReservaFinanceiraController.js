const reserva_financeira = require('../models/ReservaFinanceira');
const validaCampos = require('../library/validaCampos');


exports.Index = async (req, res) => {
  try {
    const dados = await reserva_financeira.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('reserva_financeira/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('reserva_financeira/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  res.render('reserva_financeira/novo');
};
exports.Editar = async (req, res) => {
  try {
    const data = await reserva_financeira.Reserva_financeiraId(req.params.id, req.session.empresa.id_empresa);
    res.render('reserva_financeira/editar', { data });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/reserva_financeira/index');
  }
}

exports.Salvar = async (req, res) => {
  if (!validaCampos(req, res, 'nome')) return;

  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status, id_usuario: req.session.empresa.id, id_empresa: req.session.empresa.id_empresa };
    await reserva_financeira.Salvar(dados);
    req.flash('info', 'Reserva Financeira salvo com sucesso!');
    res.redirect('/reserva_financeira/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/reserva_financeira/novo');
  }
};

exports.Update = async (req, res) => {
  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status };
    await reserva_financeira.Update(dados, req.body.id, req.body.id_empresa);
    req.flash('info', 'Reserva Financeira atualizado com sucesso!');
    res.redirect('/reserva_financeira/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/reserva_financeira/index');
  }
};

exports.Delete = async (req, res) => {
  try {
    await reserva_financeira.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Reserva Financeira deletado com sucesso!');
    res.redirect('/reserva_financeira/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/reserva_financeira/index');
  }
};


