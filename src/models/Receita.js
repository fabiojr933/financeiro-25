const knex = require('../database/postgres');

module.exports = {
    async Lista(id_empresa) {
        try {
            const receita = await knex('receita')
                .where({ 'id_empresa': id_empresa })
                .select('*');

            if (!receita) {
                return { error: 'Receita não encontrado' };
            }

            return receita;

        } catch (error) {
            throw error;
        }
    },
    async Salvar(dados) {
        try {
            await knex('receita').insert(dados);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Receita já cadastrado...');
            }
            throw error;
        }
    },
    async Update(dados, id, id_empresa) {
        try {
            await knex('receita').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    async ReceitaId(id, id_empresa) {
        try {
            const receita = await knex('receita')
                .where({ 'id': id, 'id_empresa': id_empresa })
                .select('*');

            if (!receita) {
                return { error: 'Receita não encontrado' };
            }
            return receita;
        } catch (error) {
            throw error;
        }
    },
    async DeleteId(id, id_empresa) {
        try {
            await knex('receita')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Essa receita está vinculado a um lançamento e não pode ser excluído...');
            }
            throw error;
        }
    },
};

