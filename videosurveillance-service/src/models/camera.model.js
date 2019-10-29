const cameraSchema = Joi.object().keys({
  userid: Joi.number().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  gender: Joi.string().alphanum().min(3).max(10).required(),
  access_token: [Joi.string(), Joi.number()],
  birthyear: Joi.number().integer().min(1900).max(2019),
  email: Joi.string().email({ minDomainSegments: 2 }),
  perfil: Joi.string().alphanum().min(3).max(10).required(),
  created_at: Joi.date().required(),
  updated_at: Joi.date().required()
})

module.exports = userSchema
