const knex = require('../database/postgres');

module.exports = {
    async Lista_Total_Receita(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('receita')
                .select(
                    'receita.nome',
                    knex.raw('COALESCE(SUM(lancamentos.valor_parcela), 0) as valor_total')
                )
                .leftJoin('lancamentos', function () {
                    this.on('lancamentos.origem_id', '=', 'receita.id')
                        .andOn('lancamentos.tipo', knex.raw('?', ['entrada']))
                        .andOn(knex.raw('lancamentos.origem_tipo IN (?, ?)', ['contas_receber', 'receita']))
                        .andOnBetween('lancamentos.data_lancamento', [data_inicio, data_fim]);
                })
                .where('receita.id_empresa', id_empresa)
                .groupBy('receita.nome');


            return resultado;

        } catch (error) {
            throw error;
        }
    },

    async Lista_Total_despesa_fixa(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('sub_despesa')
                .select(
                    'sub_despesa.nome',
                    knex.raw(`
      COALESCE(SUM(
        CASE 
          WHEN lancamentos.data_lancamento BETWEEN ? AND ? 
          THEN lancamentos.valor_parcela 
          ELSE 0 
        END
      ), 0) AS valor_total
    `, [data_inicio, data_fim])
                )
                .leftJoin('despesa', 'despesa.id', 'sub_despesa.id_despesa')
                .leftJoin('lancamentos', function () {
                    this.on('lancamentos.origem_id', '=', 'sub_despesa.id')
                        .andOn(knex.raw('lancamentos.tipo = ?', ['saida']))
                        .andOn(knex.raw('lancamentos.origem_tipo IN (?, ?)', ['contas_pagar', 'despesa']))
                        .andOnBetween('lancamentos.data_lancamento', [data_inicio, data_fim]);
                })
                .where('despesa.nome', 'DESPESAS FIXAS')
                .andWhere('sub_despesa.id_empresa', id_empresa)
                .groupBy('sub_despesa.nome');

            return resultado;

        } catch (error) {
            throw error;
        }
    },

    async Lista_Total_despesa_variavel(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('sub_despesa')
                .select(
                    'sub_despesa.nome',
                    knex.raw(`
      COALESCE(SUM(
        CASE 
          WHEN lancamentos.data_lancamento BETWEEN ? AND ? 
          THEN lancamentos.valor_parcela 
          ELSE 0 
        END
      ), 0) AS valor_total
    `, [data_inicio, data_fim])
                )
                .leftJoin('despesa', 'despesa.id', 'sub_despesa.id_despesa')
                .leftJoin('lancamentos', function () {
                    this.on('lancamentos.origem_id', '=', 'sub_despesa.id')
                        .andOnBetween('lancamentos.data_lancamento', [data_inicio, data_fim]);
                })
                .where('despesa.nome', 'DESPESAS VARIAVEIS')
                .andWhere('sub_despesa.id_empresa', id_empresa)
                .groupBy('sub_despesa.nome');


            return resultado;

        } catch (error) {
            throw error;
        }
    },
};

