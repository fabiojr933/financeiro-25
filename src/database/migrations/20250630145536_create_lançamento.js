exports.up = async function (knex) {
  await knex.schema.createTable('lancamentos', (t) => {
    t.increments('id').primary();
    t.string('descricao', 255);
    t.string('parcela', 10);
    t.decimal('valor_parcela', 10, 2).notNullable();
    t.date('data_emissao').notNullable().defaultTo(knex.fn.now());
    t.date('data_lancamento');
    t.text('documento');
    // Enums simulados com CHECK (usado no PostgreSQL)
    t.string('tipo', 10).notNullable();
    t.string('origem_tipo', 20).notNullable();

    t.integer('origem_id').unsigned().notNullable();

    t.integer('id_usuario')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('usuario');

    t.integer('id_empresa')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('empresa');

    t.integer('id_forma_pagamento')
      .unsigned()
      .references('id')
      .inTable('forma_pagamento');
  });

  // Adiciona CHECK constraints manualmente (se estiver usando PostgreSQL)
  await knex.raw(`
    ALTER TABLE lancamentos
    ADD CONSTRAINT check_tipo CHECK (tipo IN ('entrada', 'saida')),
    ADD CONSTRAINT check_origem_tipo CHECK (origem_tipo IN ('receita', 'despesa', 'sub_despesa', 'contas_receber', 'contas_pagar'))
  `);
};

 
exports.down = async function (knex) {
  await knex.schema.dropTable('lancamentos');
};
