import { reduce, forEach, get, map } from 'lodash'
import parse from 'url-parse'
import { getCurrentMileStoneStr, generateId } from '../../../app/utils'
import { initFiller, initActions } from '../utils'

const CONTEXT_MENU_ID = 'form_fill_menu'

chrome.contextMenus.create({
  id: CONTEXT_MENU_ID,
  title: 'Fill This Form',
  contexts: ['page'],
  documentUrlPatterns: ['http://*.jinshuju.net/f/*', 'https://*.jinshuju.net/f/*'],
})

chrome.contextMenus.create({
  id: 'separator',
  type: 'separator',
})

const updateDynamicMenus = (actions) => {
  return map(actions, (action) => {
    const id = generateId()
    const menuItemId = `action-menu-${id}`

    chrome.contextMenus.create({
      id: menuItemId,
      title: action.name,
      contexts: ['all'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    })

    const listener = (params) => {
      if (params.menuItemId === menuItemId) {
        const replaceMatchers = [
          {
            regex: /\$\{m\}/,
            value: getCurrentMileStoneStr(),
          },
          {
            regex: /\$\{m-1\}/,
            value: getCurrentMileStoneStr(-1),
          },
          {
            regex: /\$\{m\+1\}/,
            value: getCurrentMileStoneStr(1),
          },
        ]

        const targetUrl = reduce(replaceMatchers, (acc, cur) => acc.replace(cur.regex, cur.value), action.action.value)
        const targetParsed = parse(targetUrl)
        chrome.tabs.query({ active: true }, (tabs) => {
          const activeUrl = tabs[0].url

          if (activeUrl && activeUrl.match(targetParsed.hostname)) {
            chrome.tabs.update({ url: targetUrl })
          } else {
            chrome.tabs.create({ url: targetUrl })
          }
        })
      }
    }

    chrome.contextMenus.onClicked.addListener(listener)
    return { menuItemId, listener }
  })
}

let actionsMenu = []
chrome.storage.onChanged.addListener((changes) => {
  if ('actions' in changes) {
    const storageChange = changes.actions
    const newActions = storageChange.newValue

    new Promise((reslove) => {
      let i = 0
      forEach(actionsMenu, (menu) => {
        chrome.contextMenus.remove(menu.menuItemId, () => {
          chrome.contextMenus.onClicked.removeListener(menu.listener)

          if (++i >= actionsMenu.length - 1) {
            reslove()
          }
        })
      })
    }).then(() => {
      actionsMenu = updateDynamicMenus(newActions)
    })
  }
})

chrome.storage.local.get('actions', (value) => {
  const actions = get(value, 'actions', [])
  actionsMenu = updateDynamicMenus(actions)
})

chrome.contextMenus.onClicked.addListener((params, tab) => {
  if (params.menuItemId === CONTEXT_MENU_ID) {
    chrome.tabs.sendMessage(tab.id, 'fillMenuClicked')
  }
})

const installedHandler = ({ reason }) => {
  if (reason === 'install') {
    initFiller()
    initActions().then((actions) => {
      actionsMenu = updateDynamicMenus(actions)
    })
  }
}

const suspendHandler = () => {
  chrome.runtime.onInstalled.removeListener(installedHandler)
}

chrome.runtime.onInstalled.addListener(installedHandler)
chrome.runtime.onSuspend.addListener(suspendHandler)
