const receita = require('../models/Receita');
const validaCampos = require('../library/validaCampos');


exports.Index = async (req, res) => {
  try {
    const dados = await receita.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('receita/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('receita/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  res.render('receita/novo');
};
exports.Editar = async (req, res) => {
  try {
    const data = await receita.ReceitaId(req.params.id, req.session.empresa.id_empresa);
    res.render('receita/editar', { data });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/receita/index');
  }
}

exports.Salvar = async (req, res) => {
  if (!validaCampos(req, res, 'nome')) return;

  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status, id_usuario: req.session.empresa.id, id_empresa: req.session.empresa.id_empresa };
    await receita.Salvar(dados);
    req.flash('info', 'Receita salvo com sucesso!');
    res.redirect('/receita/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/receita/novo');
  }
};

exports.Update = async (req, res) => {
  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status };
    await receita.Update(dados, req.body.id, req.body.id_empresa);
    req.flash('info', 'Receita atualizado com sucesso!');
    res.redirect('/receita/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/receita/index');
  }
};

exports.Delete = async (req, res) => {
  try {
    await receita.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Receita deletado com sucesso!');
    res.redirect('/receita/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/receita/index');
  }
};


