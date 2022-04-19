import { reduce, forEach, get, map, find, isNil, isEmpty } from 'lodash'
import parse from 'url-parse'
import generateId from '../../../app/utils/generateId'
import getCurrentMileStoneStr from '../../../app/utils/getCurrentMileStoneStr'
import { initFiller, initActions, initToolbar } from '../utils'

const FORM_FILL_MENU_ID = 'form_fill_menu'

const createDynamicMenus = (actions) => {
  return Promise.all(
    map(actions, (action) => {
      const menuItemId = `action-menu-${action.id || generateId()}`

      return new Promise((reslove) => {
        chrome.contextMenus.create(
          {
            id: menuItemId,
            title: action.name,
            contexts: ['all'],
            documentUrlPatterns: ['http://*/*', 'https://*/*'],
          },
          () => {
            reslove({ menuItemId, ...action })
          }
        )
      })
    })
  )
}

const removeAllDynamicMenus = (dynamicMenus) => {
  return new Promise((reslove) => {
    if (isEmpty(dynamicMenus)) reslove()

    let i = 0
    forEach(dynamicMenus, (menu) => {
      chrome.contextMenus.remove(menu.menuItemId, () => {
        if (++i >= dynamicMenus.length - 1) {
          reslove()
        }
      })
    })
  })
}

const updateDynamicMenus = async (actions) => {
  const { dynamicMenus } = await chrome.storage.local.get('dynamicMenus')
  if (!isNil(dynamicMenus)) {
    await removeAllDynamicMenus(dynamicMenus)
  }

  const newDynamicMenus = await createDynamicMenus(actions)
  chrome.storage.local.set({ dynamicMenus: newDynamicMenus })
}

//
const storageChangedListener = async (changes) => {
  if ('actions' in changes) {
    const storageChange = changes.actions
    const newActions = storageChange.newValue
    const oldActions = storageChange.oldValue

    if (!isNil(oldActions)) {
      await updateDynamicMenus(newActions)
    }
  }
}

chrome.storage.onChanged.removeListener(storageChangedListener)
chrome.storage.onChanged.addListener(storageChangedListener)

//
const contextMenusListener = (params, tab) => {
  if (params.menuItemId === FORM_FILL_MENU_ID) {
    chrome.tabs.sendMessage(tab.id, 'fillMenuClicked')
  }
}

chrome.contextMenus.onClicked.removeListener(contextMenusListener)
chrome.contextMenus.onClicked.addListener(contextMenusListener)

//
const dynamicMenusListener = async (params) => {
  const { dynamicMenus } = await chrome.storage.local.get('dynamicMenus')
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeUrl = get(tabs, '[0].url')

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
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await initFiller()
    await initToolbar()
    await initActions()
  }

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

  const { actions } = await chrome.storage.local.get('actions')
  const dynamicMenus = await createDynamicMenus(actions)
  chrome.storage.local.set({ dynamicMenus })
}

const suspendHandler = () => {
  chrome.runtime.onInstalled.removeListener(installedHandler)
}

chrome.runtime.onInstalled.addListener(installedHandler)
chrome.runtime.onSuspend.addListener(suspendHandler)
