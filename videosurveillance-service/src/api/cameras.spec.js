/* eslint-env mocha */
const request = require('supertest')
const server = require('../server/server')

describe('Users API', () => {
  let app = null
  let testUsers = [{
    "userid": 99999,
    "username": "adminjc",
    "password": "adminjc19",
    "firstName": "Jorge",
    "lastName": "Cruz",
    "gender": "M",
    "age": 28,
    "perfil": "Deus"
  }]

  let testRepo = {
    getAllUsers () {
      return Promise.resolve(testUsers)
    },
    getUsersPrivileges () {
      return Promise.resolve(testUsers.filter(user => user.age === 28))
    },
    getUserById (id) {
      return Promise.resolve(testUsers.find(user => user.userid === id))
    }
  }

  beforeEach(() => {
    return server.start({
      port: 3000,
      repo: testRepo
    }).then(serv => {
      app = serv
    })
  })

  afterEach(() => {
    app.close()
    app = null
  })

  it('can return all users', (done) => {
    request(app)
      .get('/users')
      .expect((res) => {
        res.body.should.containEql({
          "userid": 99999,
          "username": "adminjc",
          "password": "adminjc19",
          "firstName": "Jorge",
          "lastName": "Cruz",
          "gender": "M",
          "age": 28,
          "perfil": "Deus"
        })
      })
      .expect(200, done)
  })

  it('can get user privileges', (done) => {
    request(app)
    .get('/users/privileges')
    .expect((res) => {
      res.body.should.containEql({
        "userid": 99999,
        "username": "adminjc",
        "password": "adminjc19",
        "firstName": "Jorge",
        "lastName": "Cruz",
        "gender": "M",
        "age": 28,
        "perfil": "Deus"
      })
    })
    .expect(200, done)
  })

  it('returns 200 for an known user', (done) => {
    request(app)
      .get('/users/99999')
      .expect((res) => {
        res.body.should.containEql({
          "userid": 99999,
          "username": "adminjc",
          "password": "adminjc19",
          "firstName": "Jorge",
          "lastName": "Cruz",
          "gender": "M",
          "age": 28,
          "perfil": "Deus"
        })
      })
      .expect(200, done)
  })
})
