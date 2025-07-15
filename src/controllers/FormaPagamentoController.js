const forma_pagamento = require('../models/FormaPagamento');
const validaCampos = require('../library/validaCampos');


exports.Index = async (req, res) => {
  try {
    const dados = await forma_pagamento.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('forma_pagamento/index', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('forma_pagamento/index', { dados: [] });
  }
};


exports.Novo = async (req, res) => {
  res.render('forma_pagamento/novo');
};
exports.Editar = async (req, res) => {
  try {
    const data = await forma_pagamento.FormaPagamentoId(req.params.id, req.session.empresa.id_empresa);
    res.render('forma_pagamento/editar', { data });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/forma_pagamento/index');
  }
}

exports.Salvar = async (req, res) => {
  if (!validaCampos(req, res, 'nome')) return;

  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status, id_usuario: req.session.empresa.id, id_empresa: req.session.empresa.id_empresa };
    await forma_pagamento.Salvar(dados);
    req.flash('info', 'Forma pagamento salvo com sucesso!');
    res.redirect('/forma_pagamento/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/forma_pagamento/novo');
  }
};

exports.Update = async (req, res) => {
  try {
    const dados = { nome: req.body.nome.toUpperCase(), status: req.body.status };
    await forma_pagamento.Update(dados, req.body.id, req.body.id_empresa);
    req.flash('info', 'Forma pagamento atualizado com sucesso!');
    res.redirect('/forma_pagamento/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/forma_pagamento/index');
  }
};

exports.Delete = async (req, res) => {
  try {
    await forma_pagamento.DeleteId(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Forma pagamento deletado com sucesso!');
    res.redirect('/forma_pagamento/index');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/forma_pagamento/index');
  }
};


