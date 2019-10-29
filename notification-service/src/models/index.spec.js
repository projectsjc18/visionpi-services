/* eslint-env mocha */
const test = require('assert')
const {validate} = require('./')

console.log(Object.getPrototypeOf(validate))

describe('Schemas Validation', () => {
  it('can validate a notification object', (done) => {
    const notificationSchema = {
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
    }

    validate(notificationSchema, 'notification')
      .then(value => {
        test.ok(value)
        console.log(value)
        done()
      })
      .catch(err => {
        console.log(err)
        done()
      })
  })
})
