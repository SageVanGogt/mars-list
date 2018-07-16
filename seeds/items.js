
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      // Inserts seed entries
      return knex('items').insert([
        {name: 'toothbrush', completed: false},
        {name: 'phaser beam', completed: false},
        {name: 'reproduction kit', completed: false}
      ]);
    });
};
