const knex = require('../database/postgres');
const bcrypt = require('bcryptjs');

module.exports = {
    async Login(data) {
        try {
            const usuario = await knex('usuario')
                .join('empresa', 'empresa.id', 'usuario.id_empresa')
                .select('usuario.*', 'empresa.nome', 'empresa.instance as instance', 'empresa.enviar_notificacao', 'empresa.numero_notificacao')
                .where('usuario.email', data.email)
                .first();

            if (!usuario) {
                return { error: 'Usuário não encontrado' };
            }

            if (!await bcrypt.compare(data.senha, usuario.senha)) {
                return { error: 'Senha incorreta' };
            }
            const { senha, ...dadosUsuario } = usuario;
            return { user: dadosUsuario };

        } catch (error) {
            throw error;
        }
    }
};
