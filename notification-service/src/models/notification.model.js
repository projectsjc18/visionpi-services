
const notificationSchema = (joi) => ({
  account: joi.object().keys({
    account: joi.string(),
    username: joi.string(),
    email: joi.string().email(),
    service: joi.string()
  }),
  event: joi.object().keys({
    account: joi.string(),
    device: joi.string(),
    status: joi.string(),
    type: joi.string(),
    description: joi.string(),
    registerdate: joi.date()
  })
})

module.exports = notificationSchema
