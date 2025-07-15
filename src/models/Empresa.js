const knex = require('../database/postgres');
const bcrypt = require('bcryptjs');

module.exports = {

    async Salvar(dados) {
        try {
            const [id] = await knex('empresa').insert(dados).returning('id');
            return id;
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Empresa já cadastrado...');
            }
            throw error;
        }
    },
     async Update(dados, id) {
        try {
            await knex('empresa').where({ 'id': id }).update(dados);
        } catch (error) {
            throw error;
        }
    },
        async EmpresaId(id) {
        try {
            const despesa = await knex('empresa')
                .where({ 'id': id })
                .select('*');

            if (!despesa) {
                return { error: 'Empresa não encontrado' };
            }
            return despesa;
        } catch (error) {
            throw error;
        }
    },
};

