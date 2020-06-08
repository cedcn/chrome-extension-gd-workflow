const path = '/js/inject.bundle.js'

const injectCustomJs = () => {
  const temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = chrome.extension.getURL(path)
  document.body.appendChild(temp)
}

document.addEventListener('DOMContentLoaded', () => {
  injectCustomJs()
})
