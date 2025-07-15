const fluxoModel = require('../models/Fluxo');
const reservaModel = require('../models/ReservaFinanceira');

exports.Index = async (req, res) => {
  try {
    const agora = new Date();
    const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
    const formatarData = (data) => data.toISOString().split('T')[0];
    const data_inicio = formatarData(primeiroDia);
    const data_fim = formatarData(ultimoDia);

    const receita = await fluxoModel.Lista_Total_Receita(req.session.empresa.id_empresa, data_inicio, data_fim);
    const totalReceita = receita.reduce((soma, item) => soma + parseFloat(item.valor_total || 0), 0);

    const despesa_fixa = await fluxoModel.Lista_Total_despesa_fixa(req.session.empresa.id_empresa, data_inicio, data_fim);
    const totalDespesaFixa = despesa_fixa.reduce((soma, item) => soma + parseFloat(item.valor_total || 0), 0);

    const despesa_variavel = await fluxoModel.Lista_Total_despesa_variavel(req.session.empresa.id_empresa, data_inicio, data_fim);
    const totalDespesaVariavel = despesa_variavel.reduce((soma, item) => soma + parseFloat(item.valor_total || 0), 0);

    const totalDespesas = totalDespesaFixa + totalDespesaVariavel;
    const totalLucro = totalReceita - totalDespesas;

    const reserva = await reservaModel.Lista(req.session.empresa.id_empresa);
    const totalReserva = reserva.reduce((soma, item) => soma + parseFloat(item.saldo || 0), 0);

    req.flash('info', 'Dados carregados com sucesso');
    res.render('fluxo/index',
      {
        receita, despesa_fixa, despesa_variavel, totalReceita, totalDespesaFixa, reserva, totalReserva,
        totalDespesaVariavel, totalDespesas, totalLucro, data_inicio, data_fim
      });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('fluxo/index', { dados: [] });
  }
};

exports.IndexData = async (req, res) => {
  try {
    const data_inicio = req.body.data_inicio;
    const data_fim = req.body.data_fim;

    const receita = await fluxoModel.Lista_Total_Receita(req.session.empresa.id_empresa, data_inicio, data_fim);
    const totalReceita = receita.reduce((soma, item) => soma + parseFloat(item.valor_total || 0), 0);

    const despesa_fixa = await fluxoModel.Lista_Total_despesa_fixa(req.session.empresa.id_empresa, data_inicio, data_fim);
    const totalDespesaFixa = despesa_fixa.reduce((soma, item) => soma + parseFloat(item.valor_total || 0), 0);

    const despesa_variavel = await fluxoModel.Lista_Total_despesa_variavel(req.session.empresa.id_empresa, data_inicio, data_fim);
    const totalDespesaVariavel = despesa_variavel.reduce((soma, item) => soma + parseFloat(item.valor_total || 0), 0);

    const totalDespesas = totalDespesaFixa + totalDespesaVariavel;
    const totalLucro = totalReceita - totalDespesas;

    const reserva = await reservaModel.Lista(req.session.empresa.id_empresa);
    const totalReserva = reserva.reduce((soma, item) => soma + parseFloat(item.saldo || 0), 0);

    req.flash('info', 'Dados carregados com sucesso');
    res.render('fluxo/index',
      {
        receita, despesa_fixa, despesa_variavel, totalReceita, totalDespesaFixa, reserva, totalReserva,
        totalDespesaVariavel, totalDespesas, totalLucro, data_inicio, data_fim
      });
  } catch (error) {
    console.log(error);
    req.flash('info', 'Erro: ' + error.message);
    res.render('fluxo/index', { dados: [] });
  }
};


