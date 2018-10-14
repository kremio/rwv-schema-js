const schema = require('./schema.json')
const defsSchema = require('./defs.json')

const Ajv = require('ajv')

const ajv = new Ajv({allErrors:'true'})
const validate = ajv.addSchema(defsSchema)
  .compile(schema)

module.exports = (json) => {
  const valid = validate(json)
  if (!valid) throw validate.errors
  return true
}
