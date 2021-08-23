import i18n from '@/lang'

const util = require('util')

export function stringValidator(rule, value, callback) {
  const validateResult = stringValidate(rule, value)
  if (validateResult) {
    callback(new Error(validateResult))
  } else {
    callback()
  }
}

export function stringValidate(rule, value) {
  if (rule.trim) {
    value = value.trim()
  }
  if (rule.required) {
    if (value === '') {
      return util.format(i18n.t('message.validateErrorFieldNull'), rule.fullField)
    }
  }
  if (rule.len) {
    if (value && value.length !== rule.len) {
      return util.format(i18n.t('message.validateErrorFieldLength'), rule.fullField, rule.len)
    }
  }
  if (rule.min) {
    if (value && value.length < rule.min) {
      return util.format(i18n.t('message.validateErrorFieldMin'), rule.fullField, rule.min)
    }
  }
  if (rule.max) {
    if (value && value.length > rule.max) {
      return util.format(i18n.t('message.validateErrorFieldMax'), rule.fullField, rule.max)
    }
  }
}
