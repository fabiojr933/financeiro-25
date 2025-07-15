const knex = require('../database/postgres');

module.exports = {
    async Total_saida_usuario_data(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('usuario')
                .select(
                    'usuario.nome',
                    knex.raw('SUM(lancamentos.valor_parcela) as total')
                )
                .join('lancamentos', 'usuario.id', 'lancamentos.id_usuario')
                .where('lancamentos.tipo', 'saida')
                .andWhere('lancamentos.id_empresa', id_empresa)
                .andWhereBetween('lancamentos.data_lancamento', [data_inicio, data_fim])
                .groupBy('usuario.nome');

            return resultado;

        } catch (error) {
            throw error;
        }
    },
    async Total_entrada_usuario_data(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('usuario')
                .select(
                    'usuario.nome',
                    knex.raw('SUM(lancamentos.valor_parcela) as total')
                )
                .join('lancamentos', 'usuario.id', 'lancamentos.id_usuario')
                .where('lancamentos.tipo', 'entrada')
                .andWhere('lancamentos.id_empresa', id_empresa)
                .andWhereBetween('lancamentos.data_lancamento', [data_inicio, data_fim])
                .groupBy('usuario.nome');

            return resultado;

        } catch (error) {
            throw error;
        }
    },


    async Total_forma_pagamento_data(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('forma_pagamento')
                .select(
                    'forma_pagamento.nome',
                    knex.raw('SUM(lancamentos.valor_parcela) as total')
                )
                .join('lancamentos', 'forma_pagamento.id', 'lancamentos.id_forma_pagamento')
                .where('lancamentos.tipo', 'saida')
                .andWhere('lancamentos.id_empresa', id_empresa)
                .andWhereBetween('lancamentos.data_lancamento', [data_inicio, data_fim])
                .groupBy('forma_pagamento.nome');


            return resultado;

        } catch (error) {
            throw error;
        }
    },

    async Total_forma_tipo(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('lancamentos')
                .select('lancamentos.origem_tipo')
                .sum('lancamentos.valor_parcela as total')
                .where('lancamentos.id_empresa', id_empresa)
                .whereBetween('lancamentos.data_lancamento', [data_inicio, data_fim])
                .groupBy('lancamentos.origem_tipo');

            return resultado;

        } catch (error) {
            throw error;
        }
    },

    async Total_agrupado_fluxo(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('lancamentos as l')
                .select([
                    knex.raw('COALESCE(SUM(l.valor_parcela), 0) as total'),
                    knex.raw(`
                CASE
                    WHEN l.origem_tipo = 'receita' THEN (SELECT r.nome FROM receita r WHERE r.id = l.origem_id)
                    WHEN l.origem_tipo = 'despesa' THEN (SELECT s.nome FROM sub_despesa s WHERE s.id = l.origem_id)
                    WHEN l.origem_tipo = 'contas_receber' THEN (SELECT cr.nome FROM receita cr WHERE cr.id = l.origem_id)
                    WHEN l.origem_tipo = 'contas_pagar' THEN (SELECT cp.nome FROM sub_despesa cp WHERE cp.id = l.origem_id)
                    ELSE ''
                END as origem_nome
                `)
                ])
                .leftJoin('forma_pagamento as fp', 'l.id_forma_pagamento', 'fp.id')
                .innerJoin('usuario as u', 'l.id_usuario', 'u.id')
                .innerJoin('empresa as e', 'l.id_empresa', 'e.id')
                .where('l.id_empresa', id_empresa)
                .whereBetween('l.data_lancamento', [data_inicio, data_fim])
                .groupByRaw('origem_nome');

            return resultado;

        } catch (error) {
            throw error;
        }
    },

};



