const relatorioModel = require('../models/Relatorio');

exports.Index = async (req, res) => {
  try {
    const agora = new Date();
    const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
    const formatarData = (data) => data.toISOString().split('T')[0];
    const data_inicio = formatarData(primeiroDia);
    const data_fim = formatarData(ultimoDia);

    const relatorioUsuario = await relatorioModel.RelatorioUsuario(req.session.empresa.id_empresa, data_inicio, data_fim);
    const agrupadoPorUsuario = {};

    relatorioUsuario.forEach(item => {
      if (!agrupadoPorUsuario[item.usuario]) {
        agrupadoPorUsuario[item.usuario] = { dados: [], total: 0 };
      }
      agrupadoPorUsuario[item.usuario].dados.push(item);
      agrupadoPorUsuario[item.usuario].total += parseFloat(item.valor_parcela);
    });

    req.flash('info', 'Dados carregados com sucesso');
    res.render('relatorio/index', { agrupadoPorUsuario, data_inicio, data_fim });
  } catch (error) {
  
    req.flash('info', 'Erro: ' + error.message);
    res.render('relatorio/index', { dados: [] });
  }
};

exports.IndexData = async (req, res) => {
  try {
    const data_inicio = req.body.data_inicio;
    const data_fim = req.body.data_fim;

    const relatorioUsuario = await relatorioModel.RelatorioUsuario(req.session.empresa.id_empresa, data_inicio, data_fim);
    const agrupadoPorUsuario = {};

    relatorioUsuario.forEach(item => {
      if (!agrupadoPorUsuario[item.usuario]) {
        agrupadoPorUsuario[item.usuario] = { dados: [], total: 0 };
      }
      agrupadoPorUsuario[item.usuario].dados.push(item);
      agrupadoPorUsuario[item.usuario].total += parseFloat(item.valor_parcela);
    });

    req.flash('info', 'Dados carregados com sucesso');
    res.render('relatorio/index', { agrupadoPorUsuario, data_inicio, data_fim });
  } catch (error) {
   
    req.flash('info', 'Erro: ' + error.message);
    res.render('relatorio/index', { dados: [] });
  }
};


