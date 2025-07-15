exports.up = async (knex) => {
    await knex.schema.createTable('empresa', (t) => {
        t.increments('id').primary();
        t.string('nome', 100).notNull();
        t.string('email', 100).notNull();
        t.string('telefone', 100);
        t.string('endereco', 100);
        t.string('instance', 100).notNull();
        t.string('ativo', 1).notNull();
        t.string('enviar_notificacao', 1).defaultTo('N');
        t.string('numero_notificacao', 100);
        t.unique('email');
        t.unique('nome');
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('empresa');
};