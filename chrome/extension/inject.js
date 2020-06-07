import { forEach, find, map, includes, random } from 'lodash'

const triggerFieldFill = (fieldName, fieldValue) => {
  const event = new CustomEvent('fill_value_in_form', {
    detail: { fieldName, fieldValue },
  })
  window.dispatchEvent(event)
}

const CHOICES_FIELDS = ['RadioButton', 'ImageRadioButton', 'CheckBox', 'DropDown', 'ImageCheckBox']
const A = ['RadioButton', 'ImageRadioButton', 'CheckBox', 'DropDown', 'ImageCheckBox']

window.addEventListener('load', () => {
  const injectDOM = document.createElement('div')
  injectDOM.className = 'inject-react-example'
  injectDOM.style.textAlign = 'center'
  document.body.appendChild(injectDOM)

  let ns = []
  forEach(document.getElementsByTagName('script'), (item) => {
    if (item.innerHTML.indexOf('__APOLLO_STATE__') > 0) {
      const str = item.innerHTML.split('window.__APOLLO_STATE__ =')[1]
      const str2 = str.split(';')[0]
      const datas = JSON.parse(str2)

      const d = find(datas, (itemd, key) => {
        return key.match(/fields$/)
      })

      ns = map(d.nodes, (node) => {
        const type = datas[node.id].type
        const apiCode = datas[node.id].apiCode

        let obj = {}
        obj = { type, apiCode }

        if (includes(CHOICES_FIELDS, type)) {
          obj.choiceValues = map(datas[node.id].choices, (c) => datas[c.id].value)
        }

        if (type === 'NpsField' || type === 'RatingField') {
          obj.ratingMax = datas[node.id].ratingMax
        }
        return obj
      })
    }
  })

  chrome.runtime.onMessage.addListener((request) => {
    if (request === 'fillMenuClicked') {
      chrome.storage.local.get(
        ['names', 'texts', 'textAreas', 'telephones', 'mobiles', 'emails', 'timeList', 'dataList'],
        (obj) => {
          const { names, texts, textAreas, telephones, mobiles, emails, timeList, dataList } = obj

          forEach(ns, (m) => {
            if (m.type === 'TextField') {
              triggerFieldFill(m.apiCode, texts[random(1, texts.length - 1)])
            }

            if (m.type === 'TextArea') {
              triggerFieldFill(m.apiCode, textAreas[random(1, textAreas.length - 1)])
            }

            if (m.type === 'NpsField' || m.type === 'RatingField') {
              triggerFieldFill(m.apiCode, random(1, m.ratingMax))
            }

            if (includes(A, m.type)) {
              triggerFieldFill(m.apiCode, m.choiceValues[random(1, m.choiceValues.length - 1)])
            }

            if (includes(['SortField'], m.type)) {
              triggerFieldFill(m.apiCode, m.choiceValues)
            }

            if (m.type === 'NameField') {
              triggerFieldFill(m.apiCode, names[random(1, names.length - 1)])
            }

            if (m.type === 'EmailField') {
              triggerFieldFill(m.apiCode, emails[random(1, emails.length - 1)])
            }

            if (m.type === 'TelephoneField') {
              triggerFieldFill(m.apiCode, mobiles[random(1, mobiles.length - 1)])
            }

            if (m.type === 'MobileField') {
              triggerFieldFill(m.apiCode, telephones[random(1, telephones.length - 1)])
            }

            if (m.type === 'TimeField') {
              triggerFieldFill(m.apiCode, timeList[random(1, timeList.length - 1)])
            }

            if (m.type === 'DateField') {
              triggerFieldFill(m.apiCode, dataList[random(1, dataList.length - 1)])
            }
          })
        }
      )
    }
  })
})
