const knex = require('../database/postgres');

module.exports = {
    async Lista(id_empresa) {
        try {
            const reserva_financeira = await knex('reserva_financeira')
                .where({ 'id_empresa': id_empresa })
                .select('*');

            if (!reserva_financeira) {
                return { error: 'Reserva_Financeira não encontrado' };
            }

            return reserva_financeira;

        } catch (error) {
            throw error;
        }
    },
    async Salvar(dados) {
        try {
            await knex('reserva_financeira').insert(dados);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Reverva financeiro já cadastrado...');
            }
            throw error;
        }
    },
    async Update(dados, id, id_empresa) {
        try {
            await knex('reserva_financeira').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
    async Reserva_financeiraId(id, id_empresa) {
        try {
            const reserva_financeira = await knex('reserva_financeira')
                .where({ 'id': id, 'id_empresa': id_empresa })
                .select('*');

            if (!reserva_financeira) {
                return { error: 'Reserva Financeira não encontrado' };
            }
            return reserva_financeira;
        } catch (error) {
            throw error;
        }
    },
    async DeleteId(id, id_empresa) {
        try {
            await knex('reserva_financeira')
                .where({ id: id, id_empresa: id_empresa })
                .del();
        } catch (error) {
            if (error.code === '23503') {
                throw new Error('Essa reserva financeiro está vinculado a um lançamento e não pode ser excluído...');
            }
            throw error;
        }
    },
        async Guardar(dados, id, id_empresa) {
        try {
            await knex('reserva_financeira').where({ 'id': id, 'id_empresa': id_empresa }).update(dados);
        } catch (error) {
            throw error;
        }
    },
};

