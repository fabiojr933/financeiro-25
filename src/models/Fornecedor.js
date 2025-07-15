const knex = require('../database/postgres');

module.exports = {
    async Lista(id_empresa) {
        try {
            const fornecedor = await knex('fornecedor')
                .where({ 'id_empresa': id_empresa })
                .select('*');

            if (!fornecedor) {
                return { error: 'Fornecedor não encontrado' };
            }

            return fornecedor;

        } catch (error) {
            throw error;
        }
    },
    async Salvar(dados) {
        try {
            await knex('fornecedor').insert(dados);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Fornecedor já cadastrado...');
            }
            throw error;
        }
    },
    async Update(dados, id, id_empresa) {
        try {
            await knex('fornecedor').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    async FornecedorId(id, id_empresa) {
        try {
            const fornecedor = await knex('fornecedor')
                .where({ 'id': id, 'id_empresa': id_empresa })
                .select('*');

            if (!fornecedor) {
                return { error: 'Fornecedor não encontrado' };
            }
            return fornecedor;
        } catch (error) {
            throw error;
        }
    },
    async DeleteId(id, id_empresa) {
        try {
            await knex('fornecedor')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Este fornecedor está vinculado a um lançamento e não pode ser excluído...');
            }
            throw error;
        }
    }

};

