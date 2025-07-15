const despesa = require('../models/Despesa');
const validaCampos = require('../library/validaCampos');


exports.Index = async (req, res) => {
  try {
    const dados = await despesa.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('despesa/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('despesa/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  res.render('despesa/novo');
};
exports.Editar = async (req, res) => {
  try {
    const data = await despesa.DespesaId(req.params.id, req.session.empresa.id_empresa);
    res.render('despesa/editar', { data });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/despesa/index');
  }
}

exports.Salvar = async (req, res) => {
  if (!validaCampos(req, res, 'nome')) return;

  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status, id_usuario: req.session.empresa.id, id_empresa: req.session.empresa.id_empresa };
    await despesa.Salvar(dados);
    req.flash('info', 'Despesa salvo com sucesso!');
    res.redirect('/despesa/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/despesa/novo');
  }
};

exports.Update = async (req, res) => {
  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status };
    await despesa.Update(dados, req.body.id, req.body.id_empresa);
    req.flash('info', 'Despesa atualizado com sucesso!');
    res.redirect('/despesa/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/despesa/index');
  }
};

exports.Delete = async (req, res) => {
  try {
    await despesa.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Despesa deletado com sucesso!');
    res.redirect('/despesa/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/despesa/index');
  }
};


