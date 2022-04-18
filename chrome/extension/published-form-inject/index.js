import { includes, map, get } from 'lodash'

const CHOICES_FIELDS = ['RadioButton', 'ImageRadioButton', 'CheckBox', 'DropDown', 'ImageCheckBox']

const getAvailbaleFields = (fields) => {
  const ns = fields.nodes.map((node) => {
    const type = node.type
    const apiCode = node.apiCode

    let obj = {}
    obj = { type, apiCode }

    if (includes(CHOICES_FIELDS, type)) {
      obj.choiceValues = map(node.choices, (c) => c.value)
    }

    if (type === 'NpsField' || type === 'RatingField') {
      obj.ratingMax = node.ratingMax
    }

    return obj
  })

  return ns
}

export const getFormInfo = () => {
  const data = get(GD, 'publishedFormData.data')
  const form = get(data, 'publishedForm.form')
  const status = get(data, 'publishedForm.status.key')

  const fields = getAvailbaleFields(get(form, 'fields', []))
  const token = get(form, 'token')
  const scene = get(form, 'scene')
  const enableRecovery = get(form, 'setting.enableRecovery')
  const storage = get(form, 'storageConfig.storage')

  return { fields, status, scene, enableRecovery, storage, token }
}

const formInfo = getFormInfo()
window.postMessage({ cmd: '__FORM_INFO__', context: formInfo }, window.location.origin)
