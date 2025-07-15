exports.up = async (knex) => {
    await knex.schema.createTable('reserva_financeira', (t) => {
        t.increments('id').primary();
        t.string('nome', 100).notNull();
        t.string('status', 1).notNull();
        t.date('data').notNullable().defaultTo(knex.fn.now());
        t.decimal('saldo', 10,2).defaultTo(0);
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
        t.unique(['nome', 'id_empresa', 'id_usuario']);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('reserva_financeira');
};