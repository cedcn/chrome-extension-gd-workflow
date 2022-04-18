import toolbar from './toolbar'
import formFill from './formFill'

const path = '/js/published-form-inject.bundle.js'

const injectCustomJs = () => {
  const temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = chrome.runtime.getURL(path)
  document.body.appendChild(temp)
}

injectCustomJs()

window.addEventListener(
  'message',
  (event) => {
    const command = event.data.cmd
    const context = event.data.context

    if (context && command === '__FORM_INFO__') {
      const { scene = 'form', token, enableRecovery, storage, fields } = context
      toolbar({ scene, token, enableRecovery, storage })
      formFill({ fields })
    }
  },
  false
)
