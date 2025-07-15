const modelPagamento = require('../models/FormaPagamento');
const modelReceita = require('../models/Receita');
const modelContasReceber = require('../models/ContasReceber');
const modelCliente = require('../models/Cliente');
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
        const dados = await modelCliente.Lista(req.session.empresa.id_empresa);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/novo', { dados });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_receber/novo');
    }
};

exports.Pagos = async (req, res) => {
    try {
        const dados = await modelContasReceber.Pagos(req.session.empresa.id_empresa);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/pagos', { dados });
    } catch (error) {

        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_receber/pagos');
    }
};


exports.PagosPorData = async (req, res) => {
    try {
        const data_inicio = req.body.data_inicio;
        const data_fim = req.body.data_fim;

        const dados = await modelContasReceber.PagosPorData(req.session.empresa.id_empresa, data_inicio, data_fim);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/pagos', { dados });
    } catch (error) {

        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_receber/pagos');
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

        await modelContasReceber.ExcluirLancamento(id_lancamento, req.session.empresa.id_empresa);
        await modelContasReceber.VoltarPendente(id, req.session.empresa.id_empresa, data);

        const dados = await modelContasReceber.Pagos(req.session.empresa.id_empresa);

        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/pagos', { dados });
    } catch (error) {

        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_receber/pagos');
    }
};


exports.receber = async (req, res) => {
    try {
        const pagamento = await modelPagamento.Lista(req.session.empresa.id_empresa);
        const receita = await modelReceita.Lista(req.session.empresa.id_empresa);
        const id = req.params.id;
        const conta_receber = await modelContasReceber.ListaId(req.session.empresa.id_empresa, id);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/receber', { pagamento, receita, conta_receber });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_receber/pendente');
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
                id_cliente: dados.id_cliente,
                valor_parcela: valor_parcela_formatado,
                'id_cliente': req.body.id_cliente,
                'id_empresa': req.session.empresa.id_empresa,
                'id_usuario': req.session.empresa.id,
                vencimento: dados.vencimento[i],
                'pago': false,
                'documento': numeroDocumento
            });
        }

        for (const data of parcelasSeparadas) {
            await modelContasReceber.Salvar(data);
        }

        const empresa = await empresaModel.EmpresaId(req.session.empresa.id_empresa);
        if (empresa[0].enviar_notificacao == 'S') {
            const usuario = {
                'instance': empresa[0].instance,
                'baseUrl': baseUrl,
                'apikey': apikey,
            }
            let data_mensagem = {
                text:
                    "🤖 *Bot Notificação*\n\n" +
                    "🧾 *Lançamento realizado contas a receber*\n\n" +
                    "📌 *Descrição:* " + req.body.descricao + "\n" +
                    "💰 *Valor:* " + req.body.valor_total + "\n" +
                    "📆 *Qtde parcelas:* " + req.body.parcela + "\n" +
                    "📂 *Tipo:* " + 'Entrada' + "\n" +
                    "🏷️ *Origem:* " + 'Contas a receber' + "\n" +
                    "💳 *Recebimento:* " + 'Pendente' + "\n",

                number: empresa[0].numero_notificacao
            };
            await whatsapp.sendTextGrupo(usuario, data_mensagem);
        }


        req.flash('info', 'Contas a receber cadastrado com sucesso');
        res.redirect('/contas_receber/novo');
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_receber/novo');
    }
};

exports.ListaContasPendente = async (req, res) => {
    try {
        const dados = await modelContasReceber.ListaContasPendente(req.session.empresa.id_empresa);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/pendente', { dados });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);

        res.redirect('/contas_receber/pendente');
    }
};

exports.ListaContasPendenteData = async (req, res) => {
    try {
        const data_inicio = req.body.data_inicio;
        const data_fim = req.body.data_fim;

        const dados = await modelContasReceber.ListaContasPendenteData(req.session.empresa.id_empresa, data_inicio, data_fim);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/pendente', { dados });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);

        res.redirect('/contas_receber/pendente');
    }
};

exports.Excluir = async (req, res) => {
    try {
        const id = req.params.id;
        await modelContasReceber.ExcluirParcela(id, req.session.empresa.id_empresa);
        req.flash('info', 'Pagina carregado com sucesso!');
        res.redirect('/contas_receber/pendente');
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);

        res.redirect('/contas_receber/pendente');
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
        //  console.log(req.body); return;
        const id = await modelContasReceber.Pagamento(pagamento);

        const mudar_status = {
            'pago': true,
            'data_pagamento': dataAtual,
            'id_lancamento': id.id
        }
        await modelContasReceber.Status_Pago(mudar_status, req.body.id, req.session.empresa.id_empresa);

        const dados = await modelContasReceber.ListaContasPendente(req.session.empresa.id_empresa);


        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/pendente', { dados });
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);

        res.redirect('/contas_receber/pendente');
    }
};








/*



exports.Pagos = async (req, res) => {
    try {
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/pagos');
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_receber/pagos');
    }
};

exports.receber = async (req, res) => {
    try {
        req.flash('info', 'Pagina carregado com sucesso!');
        res.render('contas_receber/receber');
    } catch (error) {
        req.flash('info', 'Erro: ' + error.message);
        res.redirect('/contas_receber/receber');
    }
};

*/


