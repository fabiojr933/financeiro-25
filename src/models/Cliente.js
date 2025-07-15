const knex = require('../database/postgres');

module.exports = {
    async Lista(id_empresa) {
        try {
            const cliente = await knex('cliente')
                .where({ 'id_empresa': id_empresa })
                .select('*');

            if (!cliente) {
                return { error: 'Clientes não encontrado' };
            }

            return cliente;

        } catch (error) {
            throw error;
        }
    },
    async Salvar(dados) {
        try {
            await knex('cliente').insert(dados);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Cliente já cadastrado...');
            }
            throw error;
        }
    },
    async Update(dados, id, id_empresa) {
        try {
            await knex('cliente').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    async ClienteId(id, id_empresa) {
        try {
            const cliente = await knex('cliente')
                .where({ 'id': id, 'id_empresa': id_empresa })
                .select('*');

            if (!cliente) {
                return { error: 'Cliente não encontrado' };
            }
            return cliente;
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Este Cliente está vinculado a um lançamento no contas a receber e não pode ser excluído...');
            }
            throw error;
        }
    },
    async DeleteId(id, id_empresa) {
        try {
            await knex('cliente')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Esse cliente está vinculado a um lançamento e não pode ser excluído...');
            }
            throw error;
        }
    },
};

