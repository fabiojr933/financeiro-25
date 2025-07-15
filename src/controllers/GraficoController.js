const graficoModel = require('../models/Graficos');

exports.Index = async (req, res) => {
  try {
    const agora = new Date();
    const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
    const formatarData = (data) => data.toISOString().split('T')[0];
    const data_inicio = formatarData(primeiroDia);
    const data_fim = formatarData(ultimoDia);

    const despesa_por_usuario = await graficoModel.Total_saida_usuario_data(req.session.empresa.id_empresa, data_inicio, data_fim);
    const entrada_por_usuario = await graficoModel.Total_entrada_usuario_data(req.session.empresa.id_empresa, data_inicio, data_fim);
    const forma_pagamento = await graficoModel.Total_forma_pagamento_data(req.session.empresa.id_empresa, data_inicio, data_fim);
    const total_forma_tipo = await graficoModel.Total_forma_tipo(req.session.empresa.id_empresa, data_inicio, data_fim);
    const total_fluxo = await graficoModel.Total_agrupado_fluxo(req.session.empresa.id_empresa, data_inicio, data_fim);

    req.flash('info', 'Dados carregados com sucesso');
    res.render('grafico/index', { data_inicio, data_fim,
      despesa_por_usuario, entrada_por_usuario, forma_pagamento, total_forma_tipo, total_fluxo
    });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('grafico/index', { dados: [] });
  }
};

exports.IndexData = async (req, res) => {
  try {
    
    const data_inicio = req.body.data_inicio;
    const data_fim = req.body.data_fim;

    const despesa_por_usuario = await graficoModel.Total_saida_usuario_data(req.session.empresa.id_empresa, data_inicio, data_fim);
    const entrada_por_usuario = await graficoModel.Total_entrada_usuario_data(req.session.empresa.id_empresa, data_inicio, data_fim);
    const forma_pagamento = await graficoModel.Total_forma_pagamento_data(req.session.empresa.id_empresa, data_inicio, data_fim);
    const total_forma_tipo = await graficoModel.Total_forma_tipo(req.session.empresa.id_empresa, data_inicio, data_fim);
    const total_fluxo = await graficoModel.Total_agrupado_fluxo(req.session.empresa.id_empresa, data_inicio, data_fim);

    req.flash('info', 'Dados carregados com sucesso');
    res.render('grafico/index', { data_inicio, data_fim,
      despesa_por_usuario, entrada_por_usuario, forma_pagamento, total_forma_tipo, total_fluxo
    });
  } catch (error) {
    req.flash('info', 'Erro: ' + error.message);
    res.render('grafico/index', { dados: [] });
  }
};


