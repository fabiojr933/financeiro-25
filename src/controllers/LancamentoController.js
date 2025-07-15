const receitaModel = require('../models/Receita');
const despesaModel = require('../models/SubDespesa');
const pagamentoModel = require('../models/FormaPagamento');
const lancamentoModel = require('../models/Lancamento');
const { v4: uuidv4 } = require('uuid');
const whatsapp = require('../models/Whatsapp');
const empresaModel = require('../models/Empresa'); 
const env = require('dotenv');

env.config();
const baseUrl = process.env.baseUrl;
const apikey = process.env.apikey;


exports.Novo = async (req, res) => {
  try {
    const receita = await receitaModel.Lista(req.session.empresa.id_empresa);
    const despesa = await despesaModel.Lista(req.session.empresa.id_empresa);
    const pagamento = await pagamentoModel.Lista(req.session.empresa.id_empresa);


    req.flash('info', 'Dados carregados com sucesso');
    res.render('lancamento/novo', { receita, despesa, pagamento });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('/lancamento/novo', { dados: [] });
  }
};

exports.Lista = async (req, res) => {
  try {
    const dados = await lancamentoModel.Lista(req.session.empresa.id_empresa);

    req.flash('info', 'Dados carregados com sucesso');
    res.render('lancamento/todos', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/lancamento/novo');
  }
};

exports.ListaData = async (req, res) => {
  try {
    const data_inicio = req.body.data_inicio;
    const data_fim = req.body.data_fim;
    const dados = await lancamentoModel.ListaData(req.session.empresa.id_empresa, data_inicio, data_fim);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('lancamento/todos', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/lancamento/novo');
  }
};


exports.Salvar = async (req, res) => {
  try {
    const dados = req.body;
    const quantidadeParcelas = dados.valor_parcela.length;
    const parcelasSeparadas = [];
    const numeroDocumento = uuidv4();
    const origem_tipo = req.body.tipo == 'saida' ? 'despesa' : 'receita';
    for (let i = 0; i < quantidadeParcelas; i++) {

      let valor_parcela_Formatado = dados.valor_parcela[i];
      let valor_parcela_formatado = valor_parcela_Formatado
        .replace('R$', '')       // remove R$
        .trim()
        .replace(/\./g, '')      // remove todos os pontos
        .replace(',', '.');      // troca a vírgula decimal por ponto

      valor_parcela_formatado = parseFloat(valor_parcela_formatado);

      parcelasSeparadas.push({
        descricao: dados.descricao.toUpperCase(),
        parcela: String(i + 1),
        valor_parcela: valor_parcela_formatado,
        'id_empresa': req.session.empresa.id_empresa,
        'id_usuario': req.session.empresa.id,
        'data_lancamento': dados.vencimento[i],
        'tipo': dados.tipo,
        'id_forma_pagamento': dados.id_forma_pagamento,
        'origem_id': dados.origem_id,
        'origem_tipo': origem_tipo,
        'documento': numeroDocumento
      });
    }

    for (const data of parcelasSeparadas) {
      await lancamentoModel.Salvar(data);
    }

    const empresa = await empresaModel.EmpresaId(req.session.empresa.id_empresa);
    // aqui buscar as informaçoes para enviar mensagem
    const mesangem = await lancamentoModel.Lancamento_para_mensagem(numeroDocumento, empresa[0].id);
   
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
          "🧾 *Lançamento realizado*\n\n" +
          "📌 *Descrição:* " + mesangem[0].descricao + "\n" +
          "💰 *Valor:* " + mesangem[0].valor + "\n" +
          "📆 *Qtde parcelas:* " + mesangem[0].qtde_parcela + "\n" +
          "📂 *Tipo:* " + mesangem[0].tipo + "\n" +
          "🏷️ *Origem:* " + mesangem[0].origem_tipo + "\n" +
          "💳 *Pagamento:* " + mesangem[0].forma_pagamento + "\n" +
          "👤 *Usuário:* " + mesangem[0].usuario + "\n" +
          "🔄 *Fluxo:* " + mesangem[0].origem_nome,

        number: empresa[0].numero_notificacao
      };
      await whatsapp.sendTextGrupo(usuario, data_mensagem);
    }


    req.flash('info', 'Lancamento realizado com sucesso');
    res.redirect('/lancamento/lista');
  } catch (error) {
    console.log(error)
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/lancamento/lista');
  }
};


exports.Excluir = async (req, res) => {
  try {
    await lancamentoModel.Excluir(req.params.id, req.session.empresa.id_empresa);
    req.flash('info', 'Lançamento deletado com sucesso!');
    res.redirect('/lancamento/lista');
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.redirect('/lancamento/lista');
  }
};
