const dashboardModel = require('../models/Dashboard');

exports.Inicio = async (req, res) => {
    try {
        const agora = new Date();
        const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1);
        const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
        const formatarData = (data) => data.toISOString().split('T')[0];
        const data_inicio = formatarData(primeiroDia);
        const data_fim = formatarData(ultimoDia);
        const total = await dashboardModel.Total_por_data(req.session.empresa.id_empresa, data_inicio, data_fim);
        const proximaPagar = await dashboardModel.ProximoVencPagar(req.session.empresa.id_empresa);
        const proximaReceber = await dashboardModel.ProximoVencReceber(req.session.empresa.id_empresa);

        res.render('index', { total, data_inicio, data_fim, proximaPagar, proximaReceber });
    } catch (error) {
       
    }
};

exports.InicioData = async (req, res) => {
    try {

        const data_inicio = req.body.data_inicio;
        const data_fim = req.body.data_fim;

        const total = await dashboardModel.Total_por_data(req.session.empresa.id_empresa, data_inicio, data_fim);
        const proximaPagar = await dashboardModel.ProximoVencPagar(req.session.empresa.id_empresa);
        const proximaReceber = await dashboardModel.ProximoVencReceber(req.session.empresa.id_empresa);

        res.render('index', { total, data_inicio, data_fim, proximaPagar, proximaReceber });
    } catch (error) {
      
    }
};


