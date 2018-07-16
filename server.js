const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/items', (request, response) => {
  return database('items').select()
    .then(items => {
      return response.status(200).json(items)
    });
});

app.post('/api/v1/items', (request, response) => {
  const { name, completed} = request.body;
  let result = ['name', 'completed']
    .every(prop => request.body.hasOwnProperty(prop));

  if(result) {
    return database('items').insert({
      name, 
      completed
    }, '*')
      .then(item => {
        return response.status(201).json({
          status: 'success',
          id: item[0].id,
          completed: item[0].completed
        })
      })
  } else {
    response.status(422).json({
      message: 'Please include all of the necessary properties in the request body'
    });
  }
})

app.delete('api/v1/items/:id', (request, response) => {
  const itemId = request.params.id;
  
  return database('items').where({
    id: itemId
  })
    .del()
    .then(() => {
      return response.status(202).json({
        message: `Success! Item had been removed.`
      });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.listen(app.get('port'), () => {
  console.log('Express intro running on localhost: 3000');
});

module.exports = app;