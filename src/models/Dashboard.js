const knex = require('../database/postgres');

module.exports = {
    async Total_por_data(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex
                .select([
                    knex.raw(`COALESCE((SELECT SUM(valor_parcela) FROM contas_a_pagar WHERE pago = false AND id_empresa = ? AND data_pagamento IS NULL AND vencimento BETWEEN ? AND ?), 0) as total_contas_pagar`, [id_empresa, data_inicio, data_fim]),
                    knex.raw(`COALESCE((SELECT SUM(valor_parcela) FROM contas_a_receber WHERE pago = false AND id_empresa = ? AND data_pagamento IS NULL AND vencimento BETWEEN ? AND ?), 0) as total_contas_receber`, [id_empresa, data_inicio, data_fim]),
                    knex.raw(`COALESCE((SELECT SUM(valor_parcela) FROM lancamentos WHERE origem_tipo IN ('despesa', 'contas_pagar') AND id_empresa = ? AND tipo = 'saida' AND data_lancamento BETWEEN ? AND ?), 0) as total_despesa`, [id_empresa, data_inicio, data_fim]),
                    knex.raw(`COALESCE((SELECT SUM(valor_parcela) FROM lancamentos WHERE origem_tipo IN ('receita', 'contas_receber') AND id_empresa = ? AND tipo = 'entrada' AND data_lancamento BETWEEN ? AND ?), 0) as total_receita`, [id_empresa, data_inicio, data_fim])
                ]);

            return resultado;

        } catch (error) {
            throw error;
        }
    },

    async ProximoVencPagar(id_empresa) {
        try {
            const resultado = await knex('contas_a_pagar')
                .select('id', 'descricao', 'valor_parcela', 'vencimento', 'parcela')
                .whereBetween('vencimento', [
                    knex.raw('CURRENT_DATE'),
                    knex.raw("CURRENT_DATE + INTERVAL '30 days'")
                ])
                .andWhere('id_empresa', id_empresa)
                .andWhere('pago', false)
                .whereNull('data_pagamento')
                .orderBy('vencimento', 'asc'); 

            return resultado;

        } catch (error) {
            throw error;
        }
    },

     async ProximoVencReceber(id_empresa) {
        try {
            const resultado = await knex('contas_a_receber')
                .select('id', 'descricao', 'valor_parcela', 'vencimento', 'parcela')
                .whereBetween('vencimento', [
                    knex.raw('CURRENT_DATE'),
                    knex.raw("CURRENT_DATE + INTERVAL '30 days'")
                ])
                .andWhere('id_empresa', id_empresa)
                .andWhere('pago', false)
                .whereNull('data_pagamento')
                .orderBy('vencimento', 'asc'); 

            return resultado;

        } catch (error) {
            throw error;
        }
    },

};

