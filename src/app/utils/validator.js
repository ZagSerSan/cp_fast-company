export function validator(data, config) {
  const errors = {}

  function validate(validateMethod, data, config) {
    let statusValidate
    switch (validateMethod) {
      case 'isRequired':
        statusValidate = data.trim() === ''
        break
      case 'isMail': {
        statusValidate = !/^\S+@\S+\.\S+$/g.test(data)
        break
      }
      case 'isCapitalSymbol':
        statusValidate = !/[A-Z]+/g.test(data)
        break
      case 'isContainDigit':
        statusValidate = !/\d+/g.test(data)
        break
      case 'isMinLenght':
        statusValidate = data.length < config.minValue
        break
      default:
        break
    }
    if (statusValidate) return config.message
  }

  for (const fieldName in data) {
    for (const validateMethod in config[fieldName]) {
      const error = validate(
        validateMethod,
        data[fieldName],
        config[fieldName][validateMethod]
      )
      if (error && !errors[fieldName]) errors[fieldName] = error
    }
  }
  return errors
}