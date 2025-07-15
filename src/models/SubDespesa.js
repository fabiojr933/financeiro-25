const knex = require('../database/postgres');

module.exports = {
    async Lista(id_empresa) {
        try {
            const sub_despesa = await knex('sub_despesa')
                .join('despesa', 'sub_despesa.id_despesa', 'despesa.id') 
                .where({ 'sub_despesa.id_empresa': id_empresa})
                .select('sub_despesa.*', 'despesa.nome as nome_despesa'); 

            if (!sub_despesa) {
                return { error: 'Sub Despesa não encontrado' };
            }

            return sub_despesa;

        } catch (error) {
            throw error;
        }
    },
    async Salvar(dados) {
        try {
            await knex('sub_despesa').insert(dados);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Sub despesa já cadastrado...');
            }
            throw error;
        }
    },
    async Update(dados, id, id_empresa) {
        try {
            await knex('sub_despesa').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    async Sub_DespesaId(id, id_empresa) {
        try {
            const sub_despesa = await knex('sub_despesa')
                .where({ 'id': id, 'id_empresa': id_empresa })
                .select('*');

            if (!sub_despesa) {
                return { error: 'Sub Despesa não encontrado' };
            }
            return sub_despesa;
        } catch (error) {
            throw error;
        }
    },
    async DeleteId(id, id_empresa) {
        try {
            await knex('sub_despesa')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Essa sub despesa está vinculado a um lançamento e não pode ser excluído...');
            }
            throw error;
        }
    },
};

