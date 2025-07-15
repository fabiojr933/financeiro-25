const modelPagamento = require('../models/FormaPagamento');
const modelDespesa = require('../models/SubDespesa');
const modelContasPagar = require('../models/ContasPagar');
const modelFornecedor = require('../models/Fornecedor');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const whatsapp = require('../models/Whatsapp');
const empresaModel = require('../models/Empresa');
const env = require('dotenv');

env.config();
const baseUrl = process.env.baseUrl;
const apikey = process.env.apikey;



exports.Novo = async (req, res) => {
    try {
        const dados = await modelFornecedor.Lista(req.session.empresa.id_empresa);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/novo', { dados });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_pagar/novo');
    }
};

exports.Pagos = async (req, res) => {
    try {
        const dados = await modelContasPagar.Pagos(req.session.empresa.id_empresa);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pagos', { dados });
    } catch (error) {

        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_pagar/pagos');
    }
};


exports.PagosPorData = async (req, res) => {
    try {
        const data_inicio = req.body.data_inicio;
        const data_fim = req.body.data_fim;

        const dados = await modelContasPagar.PagosPorData(req.session.empresa.id_empresa, data_inicio, data_fim);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pagos', { dados });
    } catch (error) {

        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_pagar/pagos');
    }
};

exports.ExcluirPagamento = async (req, res) => {
    try {
        const id = req.params.id;
        const id_lancamento = req.params.id_lancamento;

        const data = {
            'pago': false,
            'data_pagamento': null,
            'id_lancamento': null
        }

        await modelContasPagar.ExcluirLancamento(id_lancamento, req.session.empresa.id_empresa);
        await modelContasPagar.VoltarPendente(id, req.session.empresa.id_empresa, data);

        const dados = await modelContasPagar.Pagos(req.session.empresa.id_empresa);

        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pagos', { dados });
    } catch (error) {

        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_pagar/pagos');
    }
};


exports.Pagar = async (req, res) => {
    try {
        const pagamento = await modelPagamento.Lista(req.session.empresa.id_empresa);
        const receita = await modelDespesa.Lista(req.session.empresa.id_empresa);
        const id = req.params.id;
        const contaPagar = await modelContasPagar.ListaId(req.session.empresa.id_empresa, id);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pagar', { pagamento, receita, contaPagar });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_pagar/pendente');
    }
};

exports.Salvar = async (req, res) => {
    try {
        const dados = req.body;

        const quantidadeParcelas = dados.valor_parcela.length;
        const parcelasSeparadas = [];
        const numeroDocumento = uuidv4();

        for (let i = 0; i < quantidadeParcelas; i++) {
            let valorFormatado = dados.valor_total
            let valor_total_formatado = valorFormatado
                .replace('R$', '')       // remove R$
                .trim()
                .replace(/\./g, '')      // remove todos os pontos
                .replace(',', '.');      // troca a vírgula decimal por ponto

            valor_total_formatado = parseFloat(valor_total_formatado);


            let valor_parcela_Formatado = dados.valor_parcela[i];
            let valor_parcela_formatado = valor_parcela_Formatado
                .replace('R$', '')       // remove R$
                .trim()
                .replace(/\./g, '')      // remove todos os pontos
                .replace(',', '.');      // troca a vírgula decimal por ponto

            valor_parcela_formatado = parseFloat(valor_parcela_formatado);

            parcelasSeparadas.push({
                descricao: dados.descricao.toUpperCase(),
                valor_total: valor_total_formatado,
                parcela: String(i + 1),
                id_fornecedor: dados.id_fornecedor,
                valor_parcela: valor_parcela_formatado,
                'id_fornecedor': req.body.id_fornecedor,
                'id_empresa': req.session.empresa.id_empresa,
                'id_usuario': req.session.empresa.id,
                vencimento: dados.vencimento[i],
                'pago': false,
                'documento': numeroDocumento
            });
        }

        for (const data of parcelasSeparadas) {
            await modelContasPagar.Salvar(data);
        }


        const empresa = await empresaModel.EmpresaId(req.session.empresa.id_empresa);
        // aqui buscar as informaçoes para enviar mensagem

        // Falta implementar
        if (empresa[0].enviar_notificacao == 'S') {
            const usuario = {
                'instance': empresa[0].instance,
                'baseUrl': baseUrl,
                'apikey': apikey,
            }
            let data_mensagem = {
                text:
                    "🤖 *Bot Notificação*\n\n" +
                    "🧾 *Lançamento realizado contas a pagar*\n\n" +
                    "📌 *Descrição:* " + req.body.descricao + "\n" +
                    "💰 *Valor:* " + req.body.valor_total + "\n" +
                    "📆 *Qtde parcelas:* " + req.body.parcela + "\n" +
                    "📂 *Tipo:* " + 'Saida' + "\n" +
                    "🏷️ *Origem:* " + 'Contas a pagar' + "\n" +
                    "💳 *Pagamento:* " + 'Pendente' + "\n",

                number: empresa[0].numero_notificacao
            };
            await whatsapp.sendTextGrupo(usuario, data_mensagem);
        }




        req.flash('info', 'Contas a pagar cadastrado com sucesso');
        res.redirect('/contas_pagar/novo');
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_pagar/novo');
    }
};

exports.ListaContasPendente = async (req, res) => {
    try {
        const dados = await modelContasPagar.ListaContasPendente(req.session.empresa.id_empresa);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pendente', { dados });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);

        res.redirect('/contas_pagar/pendente');
    }
};

exports.ListaContasPendenteData = async (req, res) => {
    try {
        const data_inicio = req.body.data_inicio;
        const data_fim = req.body.data_fim;

        const dados = await modelContasPagar.ListaContasPendenteData(req.session.empresa.id_empresa, data_inicio, data_fim);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pendente', { dados });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);

        res.redirect('/contas_pagar/pendente');
    }
};

exports.Excluir = async (req, res) => {
    try {
        const id = req.params.id;
        await modelContasPagar.EcluirParcela(id, req.session.empresa.id_empresa);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.redirect('/contas_pagar/pendente');
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);

        res.redirect('/contas_pagar/pendente');
    }
};


exports.Pagamento = async (req, res) => {
    try {
        const dataAtual = moment().format('YYYY-MM-DD');
        const pagamento = {
            'descricao': 'PAGAMENTO DA PARCELA ' + req.body.parcela + ' NO VALOR DE ' + req.body.valor_parcela,
            'valor_parcela': parseFloat(req.body.valor_parcela),
            'parcela': req.body.parcela,
            'tipo': req.body.tipo,
            'origem_tipo': req.body.origem_tipo,
            'origem_id': Number(req.body.origem_id),
            'id_forma_pagamento': Number(req.body.id_forma_pagamento),
            'id_empresa': req.session.empresa.id_empresa,
            'id_usuario': req.session.empresa.id,
            'data_lancamento': dataAtual
        }

        const id = await modelContasPagar.Pagamento(pagamento);

        const mudar_status = {
            'pago': true,
            'data_pagamento': dataAtual,
            'id_lancamento': id.id
        }
        await modelContasPagar.Status_Pago(mudar_status, req.body.id, req.session.empresa.id_empresa);

        const dados = await modelContasPagar.ListaContasPendente(req.session.empresa.id_empresa);


        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pendente', { dados });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);

        res.redirect('/contas_pagar/pendente');
    }
};








/*



exports.Pagos = async (req, res) => {
    try {
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pagos');
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_pagar/pagos');
    }
};

exports.Pagar = async (req, res) => {
    try {
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_pagar/pagar');
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_pagar/pagar');
    }
};

*/


