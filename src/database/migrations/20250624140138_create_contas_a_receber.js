exports.up = async (knex) => {
    await knex.schema.createTable('contas_a_receber', (t) => {
        t.increments('id').primary();
        t.string('descricao', 150).notNull();
        t.decimal('valor_total', 10,2).notNull();
        t.decimal('valor_parcela', 10,2).notNull();
        t.boolean('pago').notNullable();
        t.date('data_emissao').notNullable().defaultTo(knex.fn.now());
         t.string('parcela', 15).notNull();
        t.date('vencimento').notNullable();
        t.date('data_pagamento');
        t.text('documento').notNullable();
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
        t.integer('id_cliente')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('cliente');
         t.integer('id_lancamento')        
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('contas_a_receber');
};