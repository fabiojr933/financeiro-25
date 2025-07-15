exports.up = async (knex) => {
    await knex.schema.createTable('forma_pagamento', (t) => {
        t.increments('id').primary();
        t.string('nome', 100).notNull();
        t.string('status', 1).notNull();
        t.date('data').notNullable().defaultTo(knex.fn.now());
        t.integer('id_empresa')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('empresa');
        t.integer('id_usuario')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('usuario');
        t.unique(['nome', 'id_empresa']);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('forma_pagamento');
};