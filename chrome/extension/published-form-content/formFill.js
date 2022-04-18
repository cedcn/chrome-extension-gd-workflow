import { random, forEach, sampleSize, sample } from 'lodash'

const triggerFieldFill = (fieldName, fieldValue) => {
  const event = new CustomEvent('fill_value_in_form', {
    detail: { fieldName, fieldValue },
  })
  window.dispatchEvent(event)
}

const textInputHandler = (container, mockValues, selector = 'input') => {
  const value = sample(mockValues)
  const element = container.querySelector(selector)
  element.value = value
  const event = new Event('input', {
    cancelable: true,
    bubbles: true,
  })
  element.dispatchEvent(event)
}

const main = ({ fields }) => {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message === 'fillMenuClicked') {
      chrome.storage.local.get('filler', (obj) => {
        const { names, texts, textAreas, telephones, mobiles, emails, times, dates, links } = obj.filler || {}

        forEach(fields, (m) => {
          const fieldContainer = document.querySelector(`.published-form__body div[data-api-code="${m.apiCode}"]`)
          switch (m.type) {
            case 'TextField': {
              textInputHandler(fieldContainer, texts)
              break
            }

            case 'NameField': {
              textInputHandler(fieldContainer, names)
              break
            }

            case 'TextArea': {
              textInputHandler(fieldContainer, textAreas, 'textarea')
              break
            }

            case 'LinkField': {
              textInputHandler(fieldContainer, links)
              break
            }

            case 'TimeField': {
              const value = sample(times)
              triggerFieldFill(m.apiCode, value)
              break
            }

            case 'DateField': {
              const value = sample(dates)
              triggerFieldFill(m.apiCode, value)
              break
            }

            case 'MobileField': {
              textInputHandler(fieldContainer, mobiles)
              break
            }

            case 'EmailField': {
              textInputHandler(fieldContainer, emails)
              break
            }

            case 'NpsField':
            case 'RatingField': {
              triggerFieldFill(m.apiCode, random(1, m.ratingMax))
              break
            }

            case 'NumberField': {
              const value = random(0, 100000)
              const element = fieldContainer.querySelector('input')
              element.value = value
              const event = new Event('input', {
                cancelable: true,
                bubbles: true,
              })
              element.dispatchEvent(event)
              break
            }

            case 'TelephoneField': {
              textInputHandler(fieldContainer, telephones)
              break
            }

            case 'RadioButton':
            case 'ImageRadioButton':
            case 'DropDown': {
              const value = sample(m.choiceValues)
              triggerFieldFill(m.apiCode, value)
              break
            }

            case 'CheckBox':
            case 'ImageCheckBox': {
              const count = random(1, m.choiceValues.length)
              const value = sampleSize(m.choiceValues, count)
              triggerFieldFill(m.apiCode, value)
              break
            }

            default:
              break
          }
        })
      })

      sendResponse()
    }
  })
}

export default main
