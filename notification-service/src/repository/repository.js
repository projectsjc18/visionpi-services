'use strict'
const repository = (container) => {
  const sendEmail = (payload) => {
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

            <h3>VisionPi 2019, Security Systems</h3>
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

  const sendSMS = (payload) => {
    // TODO: code for some sms service
  }

  return Object.create({
    sendSMS,
    sendEmail
  })
}

const connect = (container) => {
  return new Promise((resolve, reject) => {
    if (!container) {
      reject(new Error('dependencies not supplied!'))
    }
    resolve(repository(container))
  })
}

module.exports = Object.assign({}, {connect})
