const knex = require('../database/postgres');

module.exports = {
    async RelatorioUsuario(id_empresa, data_inicio, data_fim) {
        try {
            const resultado = await knex('lancamentos as l')
                .select([
                    'l.descricao',
                    'l.parcela',
                    'l.data_lancamento',
                    'l.valor_parcela',
                    'u.nome as usuario',
                    'fp.nome as pagamento',
                    knex.raw(`CASE
      WHEN l.origem_tipo = 'receita' THEN (SELECT r.nome FROM receita r WHERE r.id = l.origem_id)
      WHEN l.origem_tipo = 'despesa' THEN (SELECT s.nome FROM sub_despesa s WHERE s.id = l.origem_id)
      WHEN l.origem_tipo = 'contas_receber' THEN (SELECT cr.nome FROM receita cr WHERE cr.id = l.origem_id)
      WHEN l.origem_tipo = 'contas_pagar' THEN (SELECT cp.nome FROM sub_despesa cp WHERE cp.id = l.origem_id)
      ELSE ''
    END as origem_nome`)
                ])
                .leftJoin('forma_pagamento as fp', 'l.id_forma_pagamento', 'fp.id')
                .innerJoin('usuario as u', 'l.id_usuario', 'u.id')
                .innerJoin('empresa as e', 'l.id_empresa', 'e.id')
                .where('l.id_empresa', id_empresa)   // Substitua pelo valor real da empresa              
                .andWhere('l.tipo', 'saida')
                .whereBetween('l.data_lancamento', [
                    knex.raw('?', [data_inicio]),
                    knex.raw('?', [data_fim])
                ]);


            return resultado;

        } catch (error) {
            throw error;
        }
    },


};

