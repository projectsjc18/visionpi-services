/* eslint-env mocha */
const { createContainer, asValue } = require('awilix')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const should = require('should')
const request = require('supertest')
const server = require('../server/server')
const models = require('../models')
const {smtpSettings} = require('../config/config')

describe('Notification API', () => {
  let app = null

  const serverSettings = {
    port: 3000
  }

  const container = createContainer()

  container.register({
    validate: asValue(models.validate),
    serverSettings: asValue(serverSettings),
    smtpSettings: asValue(smtpSettings),
    nodemailer: asValue(nodemailer),
    smtpTransport: asValue(smtpTransport)
  })

  let _testRepo = {
    sendEmail ({container}, payload) {
      return new Promise((resolve, reject) => {
        const {smtpSettings, smtpTransport, nodemailer} = container.cradle

        const transporter = nodemailer.createTransport(
          smtpTransport({
            service: smtpSettings.service,
            auth: {
              user: smtpSettings.user,
              pass: smtpSettings.pass
            }
          }))

        const mailOptions = {
          from: '"Do Not Reply, VisionPi Company 👥" <no-replay@visionpi.com>',
          to: `${payload.account.email}`,
          subject: `Notification for service ${payload.account.service}`,
          html: `
              <h1>Events of ${payload.event.account}</h1>

              <p>Device: ${payload.event.device}</p>
              <p>Status: ${payload.event.status}</p>
              <p>Type: ${payload.event.type}</p>

              <p>description: ${payload.event.description}</p>

              <p>Date: ${payload.event.registerdate}</p>

              <h3>VisionPi 2019, Security Systems !</h3>
            `
        }

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            reject(new Error('An error occured sending an email, err:' + err))
          }
          transporter.close()
          resolve(info)
        })
      })
    }
  }

  const testRepo = {}

  testRepo.sendEmail = _testRepo.sendEmail.bind(null, {container})

  container.register({repo: asValue(testRepo)})

  beforeEach(() => {
    return server.start(container)
      .then(serv => {
        app = serv
      })
  })

  afterEach(() => {
    app.close()
    app = null
  })

  it('can make a monitoring and return the event(s)', (done) => {
    const payload = {
      account: {
        account: 'VP99999',
        username: 'Jose Perez Leon',
        email: 'amisadai.arg@gmail.com',
        service: 'Monitoring'
      },
      event: {
        account: 'VP99999',
        device: 'Door',
        status: 'Warning',
        type: 'blocked',
        description: 'Contact your administrator',
        registerdate: new Date()
      }
      // city: 'Morelia',
      // userType: 'loyal',
      // totalAmount: 71,
      // cinema: {
      //   name: 'Plaza Morelia',
      //   room: '1',
      //   seats: '53, 54'
      // },
      // movie: {
      //   title: 'Assasins Creed',
      //   format: 'IMAX',
      //   schedule: new Date()
      // },
      // orderId: '1aa90cx',
      // description: 'some description',
      // user: {
      //   name: 'Cristian Ramirez',
      //   email: 'cristiano.rosetti@gmail.com'
      // }
    }

    request(app)
      .post('/notification/sendEmail')
      .send({payload})
      .expect((res) => {
        should.ok(res.body)
      })
      .expect(200, done)
  })
})
