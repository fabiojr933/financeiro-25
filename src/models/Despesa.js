const knex = require('../database/postgres');

module.exports = {
    async Lista(id_empresa) {
        try {
            const despesa = await knex('despesa')
                .where({ 'id_empresa': id_empresa })
                .select('*');

            if (!despesa) {
                return { error: 'Despesa não encontrado' };
            }

            return despesa;

        } catch (error) {
            throw error;
        }
    },
    async Salvar(dados) {
        try {
            await knex('despesa').insert(dados);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Despesa já cadastrado...');
            }
            throw error;
        }
    },
    async Update(dados, id, id_empresa) {
        try {
            await knex('despesa').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    async DespesaId(id, id_empresa) {
        try {
            const despesa = await knex('despesa')
                .where({ 'id': id, 'id_empresa': id_empresa })
                .select('*');

            if (!despesa) {
                return { error: 'Despesa não encontrado' };
            }
            return despesa;
        } catch (error) {
            throw error;
        }
    },
    async DeleteId(id, id_empresa) {
        try {
            await knex('despesa')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Essa depesa está vinculado a um lançamento e não pode ser excluído...');
            }
            throw error;
        }
    },
};

