const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;

const testitem = require('./testitem.json');
const updateditem = require('./updateditem.json');
const testuser = require('./testuser.json');

describe('App', function() {
  it('has the default page', function(done) {
    request(app)
      .get('/')
      .expect(/Welcome to Express/, done);
  });
}); 

describe('Products API', function() {
  var id;

  it('should succesfully post test item', function(done) {
    request(app)
    .post('/api/products')
    .send(testitem)
    .end(function(err, res) {
      expect(res.body._id).not.to.be.null;
      expect(res.body.Produs).to.be.equal(testitem.Produs);
      expect(res.body.Pret).to.be.equal(testitem.Pret);
      expect(res.body.Description).to.be.equal(testitem.Description);
      if (err) {
        throw err;
      };
      id = res.body._id;
      done();
    })
  });

  it('should succesfully get test item by id', function(done) {
    request(app)
    .get('/api/product/' + id)
    .end(function(err,res) {
      expect(res.body._id).to.be.equal(id);
      expect(res.body.Produs).to.be.equal(testitem.Produs);
      expect(res.body.Pret).to.be.equal(testitem.Pret);
      expect(res.body.Description).to.be.equal(testitem.Description);
      if (err) {
        throw err;
      };
      done();
    });
  });

  it('should succesfully update test item', function(done) {
    request(app)
    .put('/api/product/' + id)
    .send(updateditem)
    .end(function(err,res) {
      expect(res.body._id).to.be.equal(id);
      expect(res.body.Produs).to.be.equal(updateditem.Produs);
      expect(res.body.Pret).to.be.equal(updateditem.Pret);
      expect(res.body.Description).to.be.equal(updateditem.Description);
      if (err) {
        throw err;
      };
      done();
    });
  });

  it('should succesfully get list of items', function(done) {
    request(app)
    .get('/api/products/')
    .end(function(err,res) {
      expect(res.body).to.not.be.null;
      if (err) {
        throw err;
      };
      done();
    });
  });

  it('should succesfully delete test item', function(done) {
    request(app)
    .delete('/api/product/' + id)
    .end(function(err,res) {
      expect(res.body._id).to.be.equal(id);
      expect(res.body.Produs).to.be.equal(updateditem.Produs);
      expect(res.body.Pret).to.be.equal(updateditem.Pret);
      expect(res.body.Description).to.be.equal(updateditem.Description);
      if (err) {
        throw err;
      };
      done();
    });
  });
});

describe("User API", function () {
  it("Should succesfully register a user", function (done) {
    request(app)
      .post("/api/users")
      .send(testuser)
      .end(function (err, res) {
        expect(res.body.id).to.not.be.undefined;
        if (err) {
          throw err;
        }
        id = res.body.id;
        done();
      });
  });
});