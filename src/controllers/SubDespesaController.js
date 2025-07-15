const sub_despesa = require('../models/SubDespesa');
const despesa = require('../models/Despesa');
const validaCampos = require('../library/validaCampos');


exports.Index = async (req, res) => {
  try {
    const dados = await sub_despesa.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('sub_despesa/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('sub_despesa/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  const data = await despesa.Lista(req.session.empresa.id_empresa);
  res.render('sub_despesa/novo', { data });
};
exports.Editar = async (req, res) => {
  try {
    const desp = await despesa.Lista(req.session.empresa.id_empresa);
    const data = await sub_despesa.Sub_DespesaId(req.params.id, req.session.empresa.id_empresa);
    res.render('sub_despesa/editar', { data, desp });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/sub_despesa/index');
  }
}

exports.Salvar = async (req, res) => {
  if (!validaCampos(req, res, 'nome')) return;

  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status, id_despesa: req.body.id_despesa, id_usuario: req.session.empresa.id, id_empresa: req.session.empresa.id_empresa };
    await sub_despesa.Salvar(dados);
    req.flash('info', 'Sub Despesa salvo com sucesso!');
    res.redirect('/sub_despesa/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/sub_despesa/novo');
  }
};

exports.Update = async (req, res) => {
  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status, id_despesa: req.body.id_despesa };
    await sub_despesa.Update(dados, req.body.id, req.body.id_empresa);
    req.flash('info', 'Sub Despesa atualizado com sucesso!');
    res.redirect('/sub_despesa/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/sub_despesa/index');
  }
};

exports.Delete = async (req, res) => {
  try {
    await sub_despesa.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Sub Despesa deletado com sucesso!');
    res.redirect('/sub_despesa/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/sub_despesa/index');
  }
};


