const knex = require('../database/postgres');

module.exports = {

    // usei
    async Salvar(dados) {
        try {
            await knex('contas_a_receber').insert(dados);
        } catch (error) {
            throw error;
        }
    },

    // usei
    async ListaContasPendente(id_empresa) {
        try {
            const contas_a_receber_pendente = await knex('contas_a_receber')
                .select(
                    'contas_a_receber.id',
                    'contas_a_receber.descricao',
                    'contas_a_receber.pago',
                    'contas_a_receber.valor_parcela',
                    'contas_a_receber.parcela',
                    'contas_a_receber.vencimento',
                    knex.raw('cliente.nome as cliente'),
                    knex.raw('usuario.nome as usuario')
                )
                .join('cliente', 'cliente.id', 'contas_a_receber.id_cliente')
                .join('usuario', 'usuario.id', 'contas_a_receber.id_usuario')
                .where('contas_a_receber.pago', false)
                .andWhere('contas_a_receber.id_empresa', id_empresa)
                .orderBy('contas_a_receber.vencimento', 'asc');

            if (contas_a_receber_pendente.length === 0) {
                return []; //erro esta aqui
            }

            return contas_a_receber_pendente;

        } catch (error) {
            throw error;
        }
    },

    // usei
   async ListaContasPendenteData(id_empresa, data_inicio, data_final) {
    try {
        const contas_a_receber_pendente = await knex('contas_a_receber')
            .select(
                'contas_a_receber.id',
                'contas_a_receber.descricao',
                'contas_a_receber.pago',
                'contas_a_receber.valor_parcela',
                'contas_a_receber.parcela',
                'contas_a_receber.vencimento',
                knex.raw('cliente.nome as cliente'),
                knex.raw('usuario.nome as usuario')
            )
            .join('cliente', 'cliente.id', 'contas_a_receber.id_cliente')
            .join('usuario', 'usuario.id', 'contas_a_receber.id_usuario')
            .where('contas_a_receber.pago', false)
            .andWhere('contas_a_receber.id_empresa', id_empresa)
            .andWhereBetween('contas_a_receber.vencimento', [data_inicio, data_final])
            .orderBy('contas_a_receber.vencimento', 'asc'); 

          
            
        return contas_a_receber_pendente;

    } catch (error) {
        throw error;
    }
},



// usei
  async ExcluirParcela(id, id_empresa) {
        try {
            await knex('contas_a_receber')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            throw error;
        }
    },

    // usei
     async ListaId(id_empresa, id) {
        try {
            const contas_a_receber_pendente = await knex('contas_a_receber')
                .select(
                    'contas_a_receber.id',
                    'contas_a_receber.descricao',
                    'contas_a_receber.pago',
                    'contas_a_receber.valor_parcela',
                    'contas_a_receber.parcela',
                    'contas_a_receber.vencimento',
                    'contas_a_receber.data_emissao',
                    knex.raw('cliente.nome as cliente'),
                    knex.raw('usuario.nome as usuario')
                )
                .join('cliente', 'cliente.id', 'contas_a_receber.id_cliente')
                .join('usuario', 'usuario.id', 'contas_a_receber.id_usuario')
                .where('contas_a_receber.pago', false)
                .andWhere('contas_a_receber.id_empresa', id_empresa)
                .andWhere('contas_a_receber.id', id);

            if (contas_a_receber_pendente.length === 0) {
                throw new Error('Nenhuma conta a receber encontrada.');
            }

            return contas_a_receber_pendente;

        } catch (error) {
            throw error;
        }
    },

    //usei
      async Pagamento(dados) {
        try {
            const [id] = await knex('lancamentos').insert(dados).returning('id');
            return id;
        } catch (error) {
            throw error;
        }
    },

    // usei
    async Status_Pago(dados, id, id_empresa) {
        try {
            await knex('contas_a_receber').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    

    async Pagos(id_empresa) {
        try {
            const contas_a_receber_pendente = await knex('contas_a_receber')
                .select(
                    'contas_a_receber.id',
                    'contas_a_receber.id_lancamento',
                    'contas_a_receber.descricao',
                    'contas_a_receber.pago',
                    'contas_a_receber.parcela',
                    'contas_a_receber.valor_parcela',
                    'contas_a_receber.vencimento',
                    'contas_a_receber.data_emissao',
                    'lancamentos.data_emissao as data_pagamento',
                    'cliente.nome as cliente',
                    'usuario.nome as usuario',
                    'forma_pagamento.nome as forma_pagamento'
                )
                .join('cliente', 'cliente.id', 'contas_a_receber.id_cliente')
                .join('usuario', 'usuario.id', 'contas_a_receber.id_usuario')
                .join('lancamentos', 'lancamentos.id', 'contas_a_receber.id_lancamento') // <-- necessário!
                .join('forma_pagamento', 'forma_pagamento.id', 'lancamentos.id_forma_pagamento') // <-- necessário!
                .where('contas_a_receber.pago', true)
                .andWhere('lancamentos.origem_tipo', 'contas_receber')
                .andWhere('contas_a_receber.id_empresa', id_empresa);

           
            return contas_a_receber_pendente;

        } catch (error) {
            throw error;
        }
    },

     async PagosPorData(id_empresa, data_inicio, data_final) {
        try {
            const contas_a_receber_pendente = await knex('contas_a_receber')
                .select(
                    'contas_a_receber.id',
                    'contas_a_receber.id_lancamento',
                    'contas_a_receber.descricao',
                    'contas_a_receber.pago',
                    'contas_a_receber.parcela',
                    'contas_a_receber.valor_parcela',
                    'contas_a_receber.vencimento',
                    'contas_a_receber.data_emissao',
                    'lancamentos.data_emissao as data_pagamento',
                    'cliente.nome as cliente',
                    'usuario.nome as usuario',
                    'forma_pagamento.nome as forma_pagamento'
                )
                .join('cliente', 'cliente.id', 'contas_a_receber.id_cliente')
                .join('usuario', 'usuario.id', 'contas_a_receber.id_usuario')
                .join('lancamentos', 'lancamentos.id', 'contas_a_receber.id_lancamento') // <-- necessário!
                .join('forma_pagamento', 'forma_pagamento.id', 'lancamentos.id_forma_pagamento') // <-- necessário!
                .where('contas_a_receber.pago', true)
                .andWhere('lancamentos.origem_tipo', 'contas_receber')
                .andWhere('contas_a_receber.id_empresa', id_empresa)
                .andWhereBetween('contas_a_receber.data_pagamento', [data_inicio, data_final]);
           
            return contas_a_receber_pendente;

        } catch (error) {
            throw error;
        }
    },


    async ExcluirLancamento(id_lancamento, id_empresa) {
        try {
            await knex('lancamentos')
                .where({ id: id_lancamento, id_empresa: id_empresa })
                .del();
        } catch (error) {
            throw error;
        }
    },
    async VoltarPendente(id, id_empresa, dados) {
        try {
            await knex('contas_a_receber').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },

};

