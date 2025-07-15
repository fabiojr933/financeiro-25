exports.up = async (knex) => {
    await knex.schema.createTable('usuario', (t) => {
        t.increments('id').primary();
        t.string('nome', 100).notNull();
        t.string('email', 100).notNull();
        t.string('senha', 100).notNull();
        t.string('ativo', 1).notNull();
        t.integer('id_empresa')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('empresa');
        t.unique(['email', 'id_empresa']);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('usuario');
};