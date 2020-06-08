import { find, keys, includes, map } from 'lodash'

const CHOICES_FIELDS = ['RadioButton', 'ImageRadioButton', 'CheckBox', 'DropDown', 'ImageCheckBox']

export const getFields = () => {
  if (window.__APOLLO_STATE__) {
    const data = window.__APOLLO_STATE__
    const apolloKeys = keys(data)
    const fieldsKey = find(apolloKeys, (key) => key.match(/fields$/))
    const fields = data[fieldsKey]

    const ns = fields.nodes.map((node) => {
      const type = data[node.id].type
      const apiCode = data[node.id].apiCode

      let obj = {}
      obj = { type, apiCode }

      if (includes(CHOICES_FIELDS, type)) {
        obj.choiceValues = map(data[node.id].choices, (c) => data[c.id].value)
      }

      if (type === 'NpsField' || type === 'RatingField') {
        obj.ratingMax = data[node.id].ratingMax
      }

      return obj
    })

    return ns
  }

  if (GD.publishedFormData) {
    const data = GD.publishedFormData.data
    const fields = data.publishedForm.form.fields

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
}

window.addEventListener('load', () => {
  const fields = getFields()
  window.postMessage({ cmd: 'getFields', data: fields }, '*')
})
