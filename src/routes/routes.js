const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/DashboardController');
const login = require('../controllers/LoginController');
const usuario = require('../controllers/UsuarioController');
const cliente = require('../controllers/ClienteController');
const fornecedor = require('../controllers/FornecedorController');
const receita = require('../controllers/ReceitaController');
const forma_pagamento = require('../controllers/FormaPagamentoController');
const reserva_financeira = require('../controllers/ReservaFinanceiraController');
const despesa = require('../controllers/DespesaController');
const sub_despesa = require('../controllers/SubDespesaController');
const pagar = require('../controllers/ContasPagarController');
const receber = require('../controllers/ContasReceberController');
const lancamento = require('../controllers/LancamentoController');
const fluxo = require('../controllers/FluxoController');
const grafico = require('../controllers/GraficoController');
const relatorio = require('../controllers/RelatorioController');
const whatsapp = require('../controllers/WhatsappController');
const empresa = require('../controllers/EmpresaController');
const cofrinho = require('../controllers/CofrinhoController');
const middleware = require('../middlewares/Session');


router.get('/', login.Login);
router.get('/cadastrar', login.Cadastrar);
router.post('/login/cadastro/novo', login.CadastrarEmpresa);
router.get('/logoff', login.logoff);
router.post('/autenticar', login.Autenticar);
router.get('/dashboard', middleware.Session, dashboard.Inicio);
router.post('/dashboard_data', middleware.Session, dashboard.InicioData);

//usuario
router.get('/usuario/novo', middleware.Session, usuario.Novo);
router.get('/usuario/index', middleware.Session, usuario.Index);
router.get('/usuario/editar/:id', middleware.Session, usuario.Editar);
router.get('/usuario/deletar/:id', middleware.Session, usuario.Delete);
router.post('/usuario/salvar', middleware.Session, usuario.Salvar);
router.post('/usuario/update', middleware.Session, usuario.Update);

//cliente
router.get('/cliente/novo', middleware.Session, cliente.Novo);
router.get('/cliente/index', middleware.Session, cliente.Index);
router.get('/cliente/editar/:id', middleware.Session, cliente.Editar);
router.get('/cliente/deletar/:id', middleware.Session, cliente.Delete);
router.post('/cliente/salvar', middleware.Session, cliente.Salvar);
router.post('/cliente/update', middleware.Session, cliente.Update);

//fornecedor
router.get('/fornecedor/novo', middleware.Session, fornecedor.Novo);
router.get('/fornecedor/index', middleware.Session, fornecedor.Index);
router.get('/fornecedor/editar/:id', middleware.Session, fornecedor.Editar);
router.get('/fornecedor/deletar/:id', middleware.Session, fornecedor.Delete);
router.post('/fornecedor/salvar', middleware.Session, fornecedor.Salvar);
router.post('/fornecedor/update', middleware.Session, fornecedor.Update);

//receita
router.get('/receita/novo', middleware.Session, receita.Novo);
router.get('/receita/index', middleware.Session, receita.Index);
router.get('/receita/editar/:id', middleware.Session, receita.Editar);
router.get('/receita/deletar/:id', middleware.Session, receita.Delete);
router.post('/receita/salvar', middleware.Session, receita.Salvar);
router.post('/receita/update', middleware.Session, receita.Update);

//despesa
router.get('/despesa/novo', middleware.Session, despesa.Novo);
router.get('/despesa/index', middleware.Session, despesa.Index);
router.get('/despesa/editar/:id', middleware.Session, despesa.Editar);
router.get('/despesa/deletar/:id', middleware.Session, despesa.Delete);
router.post('/despesa/salvar', middleware.Session, despesa.Salvar);
router.post('/despesa/update', middleware.Session, despesa.Update);

//sub_despesa
router.get('/sub_despesa/novo', middleware.Session, sub_despesa.Novo);
router.get('/sub_despesa/index', middleware.Session, sub_despesa.Index);
router.get('/sub_despesa/editar/:id', middleware.Session, sub_despesa.Editar);
router.get('/sub_despesa/deletar/:id', middleware.Session, sub_despesa.Delete);
router.post('/sub_despesa/salvar', middleware.Session, sub_despesa.Salvar);
router.post('/sub_despesa/update', middleware.Session, sub_despesa.Update);

//reserva_financeira
router.get('/reserva_financeira/novo', middleware.Session, reserva_financeira.Novo);
router.get('/reserva_financeira/index', middleware.Session, reserva_financeira.Index);
router.get('/reserva_financeira/editar/:id', middleware.Session, reserva_financeira.Editar);
router.get('/reserva_financeira/deletar/:id', middleware.Session, reserva_financeira.Delete);
router.post('/reserva_financeira/salvar', middleware.Session, reserva_financeira.Salvar);
router.post('/reserva_financeira/update', middleware.Session, reserva_financeira.Update);

//forma_pagamento
router.get('/forma_pagamento/novo', middleware.Session, forma_pagamento.Novo);
router.get('/forma_pagamento/index', middleware.Session, forma_pagamento.Index);
router.get('/forma_pagamento/editar/:id', middleware.Session, forma_pagamento.Editar);
router.get('/forma_pagamento/deletar/:id', middleware.Session, forma_pagamento.Delete);
router.post('/forma_pagamento/salvar', middleware.Session, forma_pagamento.Salvar);
router.post('/forma_pagamento/update', middleware.Session, forma_pagamento.Update);

//contas_pagar

router.get('/contas_pagar/novo', middleware.Session, pagar.Novo);
router.get('/contas_pagar/pagos', middleware.Session, pagar.Pagos);
router.get('/contas_pagar/pendente', middleware.Session, pagar.ListaContasPendente);
router.post('/contas_pagar/pendente_data', middleware.Session, pagar.ListaContasPendenteData);
router.get('/contas_pagar/excluir/:id', middleware.Session, pagar.Excluir);
router.get('/contas_pagar/pagar/:id', middleware.Session, pagar.Pagar);
router.post('/contas_pagar/salvar', middleware.Session, pagar.Salvar);
router.post('/contas_pagar/pagamento', middleware.Session, pagar.Pagamento);
router.post('/contas_pagar/pagos_data', middleware.Session, pagar.PagosPorData);
router.get('/contas_pagar/excluir_pagamento/:id/:id_lancamento', middleware.Session, pagar.ExcluirPagamento);


//contas_receber

router.get('/contas_receber/novo', middleware.Session, receber.Novo);
router.get('/contas_receber/pagos', middleware.Session, receber.Pagos);
router.get('/contas_receber/pendente', middleware.Session, receber.ListaContasPendente);
router.post('/contas_receber/pendente_data', middleware.Session, receber.ListaContasPendenteData);
router.get('/contas_receber/excluir/:id', middleware.Session, receber.Excluir);
router.get('/contas_receber/receber/:id', middleware.Session, receber.receber);
router.post('/contas_receber/salvar', middleware.Session, receber.Salvar);
router.post('/contas_receber/pagamento', middleware.Session, receber.Pagamento);
router.post('/contas_receber/pagos_data', middleware.Session, receber.PagosPorData);
router.get('/contas_receber/excluir_pagamento/:id/:id_lancamento', middleware.Session, receber.ExcluirPagamento);


router.get('/lancamento/novo', middleware.Session, lancamento.Novo);
router.post('/lancamento/salvar', middleware.Session, lancamento.Salvar);
router.get('/lancamento/lista', middleware.Session, lancamento.Lista);
router.post('/lancamento/listaData', middleware.Session, lancamento.ListaData);
router.get('/lancamento/excluir/:id', middleware.Session, lancamento.Excluir);


//fluxo
router.get('/fluxo/financeiro', middleware.Session, fluxo.Index);
router.post('/fluxo/financeiro_data', middleware.Session, fluxo.IndexData);


//grafico
router.get('/grafico/index', middleware.Session, grafico.Index);
router.post('/grafico_data/index', middleware.Session, grafico.IndexData);


//grafico
router.get('/relatorio/index', middleware.Session, relatorio.Index);
router.post('/relatorio_data/index', middleware.Session, relatorio.IndexData);

//whatsapp
router.get('/whatsapp/qrcode', middleware.Session, whatsapp.Qrcode);
router.get('/whatsapp/desconectar', middleware.Session, whatsapp.Desconectar);

//empresa
router.get('/empresa/index', middleware.Session, empresa.Configuracao);
router.post('/empresa/update', middleware.Session, empresa.Update);
router.get('/empresa/backup', middleware.Session, empresa.Backup);

//cofrinho
router.get('/cofrinho/guardar', middleware.Session, cofrinho.Guardar);
router.post('/cofrinho/guardar', middleware.Session, cofrinho.GuardarSalvar);

//cofrinho
router.get('/cofrinho/retirar', middleware.Session, cofrinho.Retirar);
router.post('/cofrinho/retirar', middleware.Session, cofrinho.RetirarSalvar);

module.exports = router;