const knex = require('../database/postgres');

module.exports = {
    async Lista(id_empresa) {
        try {
            const forma_pagamento = await knex('forma_pagamento')
                .where({ 'id_empresa': id_empresa })
                .select('*');

            if (!forma_pagamento) {
                return { error: 'Forma pagamento não encontrado' };
            }

            return forma_pagamento;

        } catch (error) {
            throw error;
        }
    },
    async Salvar(dados) {
        try {
            await knex('forma_pagamento').insert(dados);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Forma de pagamento já cadastrado...');
            }
            throw error;
        }
    },
    async Update(dados, id, id_empresa) {
        try {
            await knex('forma_pagamento').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    async FormaPagamentoId(id, id_empresa) {
        try {
            const forma_pagamento = await knex('forma_pagamento')
                .where({ 'id': id, 'id_empresa': id_empresa })
                .select('*');

            if (!forma_pagamento) {
                return { error: 'Forma pagamento não encontrado' };
            }
            return forma_pagamento;
        } catch (error) {
            throw error;
        }
    },
    async DeleteId(id, id_empresa) {
        try {
            await knex('forma_pagamento')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Essa condição de pagamento está vinculado a um lançamento e não pode ser excluído...');
            }
            throw error;
        }
    },
};

