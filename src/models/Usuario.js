const knex = require('../database/postgres');
const bcrypt = require('bcryptjs');

module.exports = {
    async Lista(id) {
        try {
            const usuarios = await knex('usuario')
                .where({ 'id_empresa': id })
                .select('*');

            if (!usuarios) {
                return { error: 'usuarios não encontrado' };
            }

            return usuarios;

        } catch (error) {
            throw error;
        }
    },
    async Salvar(dados) {
        try {
            const [id] = await knex('usuario').insert(dados).returning('id');
            return id;
        } catch (error) {
              if (error.code === '23505') {
                throw new Error('Email já cadastrado...');
            }
            throw error;
        }
    },
    async Update(dados, id, id_empresa) {
        try {
            await knex('usuario').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    async UsuarioId(id, id_empresa) {
        try {
            const usuarios = await knex('usuario')
                .where({ 'id': id, 'id_empresa': id_empresa })
                .select('*');

            if (!usuarios) {
                return { error: 'usuario não encontrado' };
            }
            return usuarios;
        } catch (error) {
            throw error;
        }
    },
    async DeleteId(id, id_empresa) {
        try {
            await knex('usuario')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Este usuario está vinculado a um lançamento e não pode ser excluído...');
            }
            throw error;
        }
    },
};

