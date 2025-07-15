const reserva_financeira = require('../models/ReservaFinanceira');
const whatsapp = require('../models/Whatsapp');
const empresaModel = require('../models/Empresa');
const env = require('dotenv');

env.config();
const baseUrl = process.env.baseUrl;
const apikey = process.env.apikey;

exports.Guardar = async (req, res) => {
  try {
    const dados = await reserva_financeira.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('cofrinho/guardar', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('/cofrinho/guardar', { dados: [] });
  }
};


exports.Retirar = async (req, res) => {
  try {
    const dados = await reserva_financeira.Lista(req.session.empresa.id_empresa);
    req.flash('info', 'Dados carregados com sucesso');
    res.render('cofrinho/retirar', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('/cofrinho/retirar', { dados: [] });
  }
};

exports.GuardarSalvar = async (req, res) => {
  try {
    let reversa = await reserva_financeira.Reserva_financeiraId(req.body.fluxo, req.session.empresa.id_empresa);
    let valor_parcela_formatado = req.body.valor_total
      .replace('R$', '')       // remove R$
      .trim()
      .replace(/\./g, '')      // remove todos os pontos
      .replace(',', '.');      // troca a vírgula decimal por ponto

    valor_parcela_formatado = parseFloat(valor_parcela_formatado);
    let saldo = parseFloat(reversa[0].saldo) + valor_parcela_formatado;
    let data = { saldo: saldo }
    await reserva_financeira.Guardar(data, req.body.fluxo, req.session.empresa.id_empresa);

    const dados = await reserva_financeira.Lista(req.session.empresa.id_empresa);

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
          "🧾 *Lançamento realizado*\n\n" +
          "📌 *Descrição:* " + 'Dinheiro guardado no cofrinho' + "\n" +
          "💰 *Valor:* R$:" + valor_parcela_formatado + "\n" +
          "📂 *Tipo:* " + 'Entrada' + "\n" +
          "🏷️ *Origem:* " + reversa[0].nome + "\n" +
          "💰 *Valor total ja guardado:* R$:" + saldo + "\n",

        number: empresa[0].numero_notificacao
      };
      await whatsapp.sendTextGrupo(usuario, data_mensagem);
    }


    req.flash('info', 'Dinheiro guardado com sucesso');
    res.render('cofrinho/guardar', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('/cofrinho/guardar', { dados: [] });
  }
};

exports.RetirarSalvar = async (req, res) => {
  try {
    let reversa = await reserva_financeira.Reserva_financeiraId(req.body.fluxo, req.session.empresa.id_empresa);
    let valor_parcela_formatado = req.body.valor_total
      .replace('R$', '')       // remove R$
      .trim()
      .replace(/\./g, '')      // remove todos os pontos
      .replace(',', '.');      // troca a vírgula decimal por ponto

    valor_parcela_formatado = parseFloat(valor_parcela_formatado);
    
    if (parseFloat(reversa[0].saldo) < valor_parcela_formatado) {
      req.flash('info', 'O valor da saida não pode se maior o que o SALDO disponivel!');
    } else {
      let saldo = parseFloat(reversa[0].saldo) - valor_parcela_formatado;
      let data = { saldo: saldo }
      await reserva_financeira.Guardar(data, req.body.fluxo, req.session.empresa.id_empresa);
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
            "🧾 *Lançamento realizado*\n\n" +
            "📌 *Descrição:* " + 'Dinheiro retirado do cofrinho' + "\n" +
            "💰 *Valor:* R$" + valor_parcela_formatado + "\n" +
            "📂 *Tipo:* " + 'Entrada' + "\n" +
            "🏷️ *Origem:* " + reversa[0].nome + "\n" +
            "💰 *Valor total ja guardado:* R$:" + saldo + "\n",

          number: empresa[0].numero_notificacao
        };
        await whatsapp.sendTextGrupo(usuario, data_mensagem);
      }      
      req.flash('info', 'Dinheiro retirado com sucesso');
    }
    const dados = await reserva_financeira.Lista(req.session.empresa.id_empresa);
    res.render('cofrinho/retirar', { dados });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('/cofrinho/retirar', { dados: [] });
  }
};