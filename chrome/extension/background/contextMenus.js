import { reduce, forEach, get, map, find } from 'lodash'
import parse from 'url-parse'
import getCurrentMileStoneStr from '../../../app/utils/getCurrentMileStoneStr'
import generateId from '../../../app/utils/generateId'
import { initFiller, initActions, initToolbar } from '../utils'

let dynamicMenus = []

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

    return { menuItemId, ...action }
  })
}
//
const storageChangedListener = (changes) => {
  if ('actions' in changes) {
    const storageChange = changes.actions
    const newActions = storageChange.newValue

    new Promise((reslove) => {
      let i = 0
      forEach(dynamicMenus, (menu) => {
        chrome.contextMenus.remove(menu.menuItemId, () => {
          if (++i >= dynamicMenus.length - 1) {
            reslove()
          }
        })
      })
    }).then(() => {
      dynamicMenus = updateDynamicMenus(newActions)
    })
  }
}

chrome.storage.onChanged.removeListener(storageChangedListener)
chrome.storage.onChanged.addListener(storageChangedListener)

//
const FORM_FILL_MENU_ID = 'form_fill_menu'
const contextMenusListener = (params, tab) => {
  if (params.menuItemId === FORM_FILL_MENU_ID) {
    chrome.tabs.sendMessage(tab.id, 'fillMenuClicked')
  }
}

chrome.contextMenus.onClicked.removeListener(contextMenusListener)
chrome.contextMenus.onClicked.addListener(contextMenusListener)

//
const dynamicMenusListener = (params) => {
  const selectedMenu = find(dynamicMenus, (menu) => menu.menuItemId === params.menuItemId)

  if (selectedMenu) {
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

    const targetUrl = reduce(
      replaceMatchers,
      (acc, cur) => acc.replace(cur.regex, cur.value),
      selectedMenu.action.value
    )
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

chrome.contextMenus.onClicked.removeListener(dynamicMenusListener)
chrome.contextMenus.onClicked.addListener(dynamicMenusListener)

//
const installedHandler = async ({ reason }) => {
  chrome.contextMenus.create({
    id: FORM_FILL_MENU_ID,
    title: 'Fill This Form',
    contexts: ['page'],
    documentUrlPatterns: ['http://*.jinshuju.net/f/*', 'https://*.jinshuju.net/f/*'],
  })

  chrome.contextMenus.create({
    id: 'separator',
    type: 'separator',
  })

  chrome.storage.local.get('actions', (value) => {
    const actions = get(value, 'actions', [])
    dynamicMenus = updateDynamicMenus(actions)
  })

  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await initFiller()
    await initToolbar()
    initActions().then((actions) => {
      dynamicMenus = updateDynamicMenus(actions)
    })
  }
}

const suspendHandler = () => {
  chrome.runtime.onInstalled.removeListener(installedHandler)
}

chrome.runtime.onInstalled.addListener(installedHandler)
chrome.runtime.onSuspend.addListener(suspendHandler)
