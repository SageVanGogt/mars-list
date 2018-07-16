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

app.listen(app.get('port'), () => {
  console.log('Express intro running on localhost: 3000');
});

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
    }, 'id')
      .then(itemId => {
        return response.status(201).json({
          status: 'success',
          id: itemId[0]
        })
      })
  } else {
    response.status(422).json({
      message: 'Please include all of the necessary properties in the request body'
    });
  }
})

module.exports = app;