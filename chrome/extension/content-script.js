/* eslint-disable camelcase */
import { random, forEach, sampleSize, sample, template } from 'lodash'
import { css } from '@emotion/css'

let fields = []

const showIconSvg = `
<svg t="1631950721668" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4432" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
<defs>
  <style type="text/css"></style>
</defs>
<path d="M758.13 265.87H470.98c-27.35-4.69-41.02-18.37-41.02-41.02s13.68-36.33 41.02-41.02h369.2v369.19c0 27.35-13.67 41.02-41.02 41.02s-41.02-13.68-41.03-41.02V265.87zM265.87 758.13h287.15c27.35 4.69 41.02 18.37 41.02 41.02 0 22.66-13.68 36.33-41.02 41.02H183.83v-369.2c0-27.35 13.67-41.02 41.02-41.02s41.02 13.68 41.02 41.02v287.16z" fill="#2E3133" p-id="4433"></path>
<path d="M338.67 627.32l288.65-288.65a0.996 0.996 0 0 1 1.41 0l56.6 56.6c0.39 0.39 0.39 1.02 0 1.41L396.68 685.33a0.996 0.996 0 0 1-1.41 0l-56.6-56.6a0.996 0.996 0 0 1 0-1.41z" fill="#2E3133" opacity=".3" p-id="4434"></path>
</svg>`

const hideIconSvg = `
<svg t="1631951445879" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7875" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18">
	<defs>
		<style type="text/css"></style>
	</defs>
	<path d="M758.4 729.6c12.8 12.8 12.8 32 0 44.8s-28.8 12.8-41.6 3.2l-3.2-3.2-201.6-201.6-201.6 201.6c-12.8 12.8-28.8 12.8-41.6 3.2l-3.2-3.2c-12.8-12.8-12.8-28.8-3.2-41.6l3.2-3.2 224-224c12.8-12.8 28.8-12.8 41.6-3.2l3.2 3.2 224 224z" fill="#2875e8" p-id="7876"></path>
	<path d="M758.4 489.6c12.8 12.8 12.8 32 0 44.8-12.8 12.8-28.8 12.8-41.6 3.2l-3.2-3.2-201.6-201.6-201.6 201.6c-12.8 12.8-28.8 12.8-41.6 3.2l-3.2-3.2c-12.8-12.8-12.8-28.8-3.2-41.6l3.2-3.2 224-224c12.8-12.8 28.8-12.8 41.6-3.2l3.2 3.2 224 224z" fill="#C70019" p-id="7877"></path>
</svg>`

const sceneMap = {
  reservation: '预约',
  form: '表单',
  survey: '调查问卷',
  exam: '考试测评',
  vote: '投票',
  registry: '活动报名',
  customer_acquisition: '落地页',
  evaluation: '测评',
  online_payment: '在线支付',
}

const __c_container = css`
  display: block;
`

const __c_hideBtn = css`
  display: none;
  margin-right: 21px;
`

const __c_showBtn = css`
  position: fixed;
  bottom: 15px;
  left: 15px;
  z-index: 9999999;
  background-color: rgba(255, 255, 255, 0.5);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
`

const __c_toolbar = css`
  position: fixed;
  display: none;
  bottom: 0;
  width: 100%;
  background-color: rgba(221, 221, 221, 0.5);
  padding: 0 14px;
  font-size: 12px;
  z-index: 9999999;
  align-items: center;
  justify-content: space-between;
`

const __c_toolbarLeft = css`
  display: flex;
  align-items: center;
`

const __c_toolbarRight = css`
  display: flex;
  align-items: center;
  color: #7b7b7b;

  > div:not(:last-child) {
    margin-right: 10px;
  }
`

const __c_actions = css`
  display: flex;
  align-items: center;
`

const __c_action = css`
  display: inline-block;
  padding: 0 8px;
  color: #4c4c4c;

  &:hover {
    color: #5198f5;
  }
`
const __c_statusValue = css`
  color: #2875e8;
`

const __c_isShow = css({
  [`.${__c_showBtn}`]: {
    display: 'none',
  },
  [`.${__c_hideBtn}`]: {
    display: 'flex',
  },
  [`.${__c_toolbar}`]: {
    display: 'flex',
  },
})

const styles = {
  container: __c_container,
  hideBtn: __c_hideBtn,
  showBtn: __c_showBtn,
  isShow: __c_isShow,
  toolbar: __c_toolbar,
  toolbarLeft: __c_toolbarLeft,
  toolbarRight: __c_toolbarRight,
  action: __c_action,
  actions: __c_actions,
  statusValue: __c_statusValue,
}

window.addEventListener(
  'message',
  (e) => {
    if (e.data && e.data.cmd === '__FORM_INFO__') {
      const host = window.location.origin
      const { scene = 'form', token, enableRecovery, storage } = e.data.data
      fields = e.data.data.fields

      const compiled = template(
        `<div class="${styles.container} ${styles.isShow}">
          <a class="${styles.showBtn}">${showIconSvg}</a>
          <div class="${styles.toolbar}">
            <div class="${styles.toolbarLeft}">
              <a class="${styles.hideBtn}">${hideIconSvg}</a>
              <div class="${styles.actions}">
                <a class="${styles.action}" href="${host}/forms/${token}/edit" target="_self">Edit</a>
                <a class="${styles.action}" href="${host}/forms/${token}/setting" target="_self">Setting</a>
                <a class="${styles.action}" href="${host}/forms/${token}/entries" target="_self">Entries</a>
                <a class="${styles.action}" href="${host}/forms/${token}/reports" target="_self">Reports</a>
              </div>
            </div>
            <div class="${styles.toolbarRight}">
              <div>scene: <span class="${styles.statusValue}">${sceneMap[scene] || scene}</span></div>
              <div>storage: <span class="${styles.statusValue}">${storage}</span></div>
              <div>recovery: <span class="${styles.statusValue}">${enableRecovery ? 'on' : 'off'}</span></div>
            </div>
          </div>
        </div>`
      )

      const html = compiled()

      const root = document.createElement('div')
      root.innerHTML = html
      document.body.appendChild(root)

      const container = root.querySelector(`.${__c_container}`)
      const showBtn = container.querySelector(`.${__c_showBtn}`)
      const hideBtn = container.querySelector(`.${__c_hideBtn}`)

      showBtn.addEventListener('click', function() {
        container.classList.add(__c_isShow)
      })

      hideBtn.addEventListener('click', function() {
        container.classList.remove(__c_isShow)
      })
    }
  },
  false
)

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

chrome.runtime.onMessage.addListener((request) => {
  if (request === 'fillMenuClicked') {
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
  }
})
