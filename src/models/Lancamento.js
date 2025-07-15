const knex = require('../database/postgres');

module.exports = {
    async Salvar(dados) {
        try {
            await knex('lancamentos').insert(dados);
        } catch (error) {
            throw error;
        }
    },

    async Lista(id_empresa) {
        try {
            const contas_a_pagar_pendente = await knex('lancamentos')
                .select(
                    'lancamentos.id',
                    'lancamentos.descricao',
                    'lancamentos.valor_parcela',
                    'lancamentos.parcela',
                    'lancamentos.data_lancamento',
                    'lancamentos.tipo',
                    knex.raw('forma_pagamento.nome as pagamento'),
                    knex.raw('usuario.nome as usuario')
                )
                .join('forma_pagamento', 'forma_pagamento.id', 'lancamentos.id_forma_pagamento')
                .join('usuario', 'usuario.id', 'lancamentos.id_usuario')
                .where('lancamentos.id_empresa', id_empresa)
                .whereIn('lancamentos.origem_tipo', ['receita', 'despesa'])
                .orderBy('lancamentos.id', 'desc');

            if (contas_a_pagar_pendente.length === 0) {
                return []; //erro esta aqui
            }

            return contas_a_pagar_pendente;

        } catch (error) {
            throw error;
        }
    },

    async ListaData(id_empresa, data_inicio, data_fim) {
        try {
            const contas_a_pagar_pendente = await knex('lancamentos')
                .select(
                    'lancamentos.id',
                    'lancamentos.descricao',
                    'lancamentos.valor_parcela',
                    'lancamentos.parcela',
                    'lancamentos.data_lancamento',
                    'lancamentos.tipo',
                    knex.raw('forma_pagamento.nome as pagamento'),
                    knex.raw('usuario.nome as usuario')
                )
                .join('forma_pagamento', 'forma_pagamento.id', 'lancamentos.id_forma_pagamento')
                .join('usuario', 'usuario.id', 'lancamentos.id_usuario')
                .where('lancamentos.id_empresa', id_empresa)
                .andWhereBetween('lancamentos.data_lancamento', [data_inicio, data_fim])
                .whereIn('lancamentos.origem_tipo', ['receita', 'despesa'])
                .orderBy('lancamentos.id', 'desc');

            if (contas_a_pagar_pendente.length === 0) {
                return []; //erro esta aqui
            }

            return contas_a_pagar_pendente;

        } catch (error) {
            throw error;
        }
    },

    async Excluir(id, id_empresa) {
        try {
            await knex('lancamentos')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            throw error;
        }
    },

    async Lancamento_para_mensagem(documento, id_empresa) {
        try {
            const resultado = await knex('lancamentos as l')
                .select([
                    knex.raw('SUM(l.valor_parcela) as valor'),
                    knex.raw('MAX(l.parcela) as qtde_parcela'),
                    'l.descricao',
                    'l.tipo',
                    'l.origem_tipo',
                    'fp.nome as forma_pagamento',
                    'u.nome as usuario',
                    knex.raw(`
                        CASE
                            WHEN l.origem_tipo = 'receita' THEN (SELECT r.nome FROM receita r WHERE r.id = l.origem_id)
                            WHEN l.origem_tipo = 'despesa' THEN (SELECT s.nome FROM sub_despesa s WHERE s.id = l.origem_id)
                            ELSE ''
                        END AS origem_nome
                        `)
                ])
                .leftJoin('forma_pagamento as fp', 'l.id_forma_pagamento', 'fp.id')
                .innerJoin('usuario as u', 'l.id_usuario', 'u.id')
                .innerJoin('empresa as e', 'l.id_empresa', 'e.id')
                .where('l.documento', documento)
                .andWhere('l.id_empresa', id_empresa)
                .groupBy([
                    'l.descricao',
                    'l.tipo',
                    'l.origem_tipo',
                    'fp.nome',
                    'u.nome',
                    knex.raw(`
                        CASE
                            WHEN l.origem_tipo = 'receita' THEN (SELECT r.nome FROM receita r WHERE r.id = l.origem_id)
                            WHEN l.origem_tipo = 'despesa' THEN (SELECT s.nome FROM sub_despesa s WHERE s.id = l.origem_id)
                            ELSE ''
                        END
                        `)
                ]);

            return resultado
        } catch (error) {
            throw error;
        }
    },

};

