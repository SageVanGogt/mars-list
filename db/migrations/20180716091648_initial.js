
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('items', function (table) {
      table.increments('id');
      table.string('name');
      table.bool('completed');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items')
  ]);
};
