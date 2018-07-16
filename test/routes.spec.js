const environment = process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('CLIENT routes', () => {
  it('should receive a response of a html when we hit the root endpoint', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      })
  })

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/vegan')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
  })
})

describe('API routes', () => {
  beforeEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        knex.migrate.latest()
          .then(function () {
            return knex.seed.run()
              .then(function () {
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    knex.migrate.rollback()
      .then(function () {
        done();
      });
  });

  describe('GET /api/v1/items', () => {
    it('should return an array of items', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array')
          response.body.length.should.equal(3);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('toothbrush');
          done();
        })
    })
  })

  describe('POST /api/v1/items', () => {
    it('should create a new item', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'frickin laser beam',
          completed: false
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
          response.body.should.have.property('completed');
          response.body.completed.should.equal(false);
          response.body.should.have.property('status');
          response.body.status.should.equal('success');
          done();
        })
    })

    it('should not create a record if the post body is missing info', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          completed: false
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.message.should.equal('Please include all of the necessary properties in the request body');
          done();
        })
    })
  })

  describe('DELETE /api/v1/items/:id', () => {
    it('should remove an item from the database based on id', done => {
      knex('items')
        .select('*')
        .then((items) => {
          const itemObject = items[0];
          const lengthBeforeDelete = items.length;
          chai.request(server)
            .delete(`/api/v1/items/${itemObject.id}`)
            .end((err, response) => {
              should.not.exist(err);
              response.status.should.equal(202);
              response.type.should.equal('application/json');
              response.body.message.should.equal('Success! Item had been removed.');
              knex('items').select('*')
                .then((updatedItem) => {
                  updatedItem.length.should.equal(lengthBeforeDelete - 1);
                  done();
                });
            });
        });
    })
  })

  describe('PATCH /api/v1/items/:id', () => {
    it('should update item completion status', done => {
      chai.request(server)
        .patch('/api/v1/items/1')
        .send({
          completed: true
        })
        .end((err, response) => {
          response.should.have.status(203);
          response.body.should.be.a('object');
          response.body.should.have.property('status');
          response.body.status.should.equal('success');
          done();
        });
    });
  });
})