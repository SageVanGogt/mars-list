
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      // Inserts seed entries
      return knex('items').insert([
        {id: 1, name: 'toothbrush', completed: false},
        {id: 2, name: 'phaser beam', completed: false},
        {id: 3, name: 'reproduction kit', completed: false}
      ]);
    });
};
