const fornecedor = require('../models/Fornecedor');
const validaCampos = require('../library/validaCampos');


exports.Index = async (req, res) => {
  try {
    const dados = await fornecedor.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('fornecedor/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('fornecedor/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  res.render('fornecedor/novo');
};
exports.Editar = async (req, res) => {
  try {
    const data = await fornecedor.FornecedorId(req.params.id, req.session.empresa.id_empresa);
    res.render('fornecedor/editar', { data });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/fornecedor/index');
  }
}

exports.Salvar = async (req, res) => {
  if (!validaCampos(req, res, 'nome')) return;

  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status, id_usuario: req.session.empresa.id, id_empresa: req.session.empresa.id_empresa };
    await fornecedor.Salvar(dados);
    req.flash('info', 'Fornecedor salvo com sucesso!');
    res.redirect('/fornecedor/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/fornecedor/novo');
  }
};

exports.Update = async (req, res) => {
  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status };
    await fornecedor.Update(dados, req.body.id, req.body.id_empresa);
    req.flash('info', 'Fornecedor atualizado com sucesso!');
    res.redirect('/fornecedor/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/fornecedor/index');
  }
};

exports.Delete = async (req, res) => {
  try {
    await fornecedor.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Fornecedor deletado com sucesso!');
    res.redirect('/fornecedor/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/fornecedor/index');
  }
};


