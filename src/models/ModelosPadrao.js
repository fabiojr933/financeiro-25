const knex = require('../database/postgres');

module.exports = {
    async InserirReceita(id_usuario, id_empresa) {
        try {
            const receitasPadrao = [
                'SALÁRIO',
                'FÉRIAS',
                '13º SALÁRIO',
                'RESCISÃO',
                'HORAS EXTRAS',
                'ADIANTAMENTO',
                'PLANO DE SAÚDE'
            ];

            const receitasInserir = receitasPadrao.map(nomeReceita => ({
                nome: nomeReceita.toUpperCase(),
                status: 'S',
                id_usuario,
                id_empresa
            }));

            await knex('receita').insert(receitasInserir);
        } catch (error) {
            throw error;
        }
    },

    async InserirReserva_financeira(id_usuario, id_empresa) {
        try {
            const ReservaFinanceiroPadrao = [
                'EMERGÊNCIAS',
                'OBJETIVOS DIVERSOS'
            ];

            const ReservaFinanceiroInserir = ReservaFinanceiroPadrao.map(nome => ({
                nome: nome.toUpperCase(),
                status: 'S',
                id_usuario,
                id_empresa
            }));

            await knex('reserva_financeira').insert(ReservaFinanceiroInserir);
        } catch (error) {
            throw error;
        }
    },

    async InserirDespesaFixa(id_usuario, id_empresa) {
        const dados = {
            'nome': 'DESPESAS FIXAS',
            'status': 'S',
            'id_usuario': id_usuario,
            'id_empresa': id_empresa
        }
        try {
            const [id] = await knex('despesa').insert(dados).returning('id');
            return id
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Receita já cadastrado...');
            }
            throw error;
        }
    },
    async InserirSubDespesaFixa(id_usuario, id_empresa, id_despesa) {
        try {
            const ReservaFinanceiroPadrao = [
                'PRESTAÇÃO DA CASA',
                'ENERGIA',
                'AGUA',
                'PLANO DE CELULAR',
                'PLANO DE TV POR ASSINATURA',
                'INTERNET',
                'MENSALIDADE DE SISTEMA',
                'SEGURO'
            ];

            const ReservaFinanceiroPadraoInserir = ReservaFinanceiroPadrao.map(nome => ({
                nome: nome,
                status: 'S',
                id_usuario,
                id_empresa,
                id_despesa
            }));

            await knex('sub_despesa').insert(ReservaFinanceiroPadraoInserir);
        } catch (error) {
            throw error;
        }
    },


    async InserirDespesaVaricavel(id_usuario, id_empresa) {
        const dados = {
            'nome': 'DESPESAS VARIAVEIS',
            'status': 'S',
            'id_usuario': id_usuario,
            'id_empresa': id_empresa
        }
        try {
            const [id] = await knex('despesa').insert(dados).returning('id');
            return id
        } catch (error) {
            throw error;
        }
    },
    async InserirSubDespesaVariavel(id_usuario, id_empresa, id_despesa) {
        try {
            const SubDespesaVariavelPadrao = [
                'COMPRAS DE MERCADO',
                'ALMOÇO SEMANAL',
                'LANCHES DIÁRIOS',
                'FARMÁCIA',
                'MATERIAIS ESCOLARES',
                'JORNAIS/REVISTAS',
                'CUIDADOS E HIGIENE PESSOAL',
                'VESTUÁRIO E ACESSÓRIOS',
                'PRESENTES',
                'MANUTENÇÃO',
                'COMBUSTÍVEL',
                'IPVA',
                'SEGURO',
                'TRANSPORTE PÚBLICO',
                'CINEMA/TEATRO',
                'BARES E RESTAURANTES',
                'PASSEIOS/PARQUES/PRAIA',
                'VIAGENS',
                'DESPESAS C/ VIAGENS',
                'UNIFORMES',
                'PUBLICIDADE E PROPAGA',
                'FRETES E EMBALAGENS',
                'CURSOS E TREINAMENTOS',
                'DOACOES E PATROCIONIOS',
                'BRINDES',
                'EVENTOS DIVERSOS',
                'CORREIOS',
                'DESPESAS DE ESCRITORIO',
                'MANUTENCAO CASA',
                'MANUTENCAO DE EQUIPAMENTO',
                'DESPESAS COM IMPOSTOS',
                'DESPESAS FINANCEIRAS'
            ];

            const SubDespesaVariavelPadraoInserir = SubDespesaVariavelPadrao.map(nome => ({
                nome: nome,
                status: 'S',
                id_usuario,
                id_empresa,
                id_despesa
            }));

            await knex('sub_despesa').insert(SubDespesaVariavelPadraoInserir);
        } catch (error) {
            throw error;
        }
    },

    async ClientePadraoInsert(id_usuario, id_empresa) {
        try {
            await knex('cliente').insert({ 'nome': 'CLIENTE PADRAO', 'status': 'S', 'id_empresa': id_empresa, 'id_usuario': id_usuario });
        } catch (error) {
            throw error;
        }
    },

     async FornecedorPadraoInsert(id_usuario, id_empresa) {
        try {
            await knex('fornecedor').insert({ 'nome': 'FORNECEDOR PADRAO', 'status': 'S', 'id_empresa': id_empresa, 'id_usuario': id_usuario });
        } catch (error) {
            throw error;
        }
    },

     async InserirFormaPagamento(id_usuario, id_empresa) {
        try {
            const condPagamentoPadrao = [
                'PIX',
                'BOLETO',
                'CARTAO',
                'DINHEIRO',
                'TRANSFERENCIA',
                'CHEQUE',
                'CREDIARIO'
            ];

            const condPagamentoInserir = condPagamentoPadrao.map(nomeReceita => ({
                nome: nomeReceita.toUpperCase(),
                status: 'S',
                id_usuario,
                id_empresa
            }));

            await knex('forma_pagamento').insert(condPagamentoInserir);
        } catch (error) {
            throw error;
        }
    },

}