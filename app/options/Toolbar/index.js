import React, { useState, useEffect } from 'react'
import { get } from 'lodash'
import { Switch, message } from 'antd'
import styles from './index.module.css'

const Toolbar = () => {
  const [toolbar, setToolbar] = useState({ enable: false, show: false })

  const onDisableToggle = (checked) => {
    chrome.storage.local.set({ toolbar: { ...toolbar, disable: checked } }, () => {
      message.success('更新成功')
    })
  }

  const onHiddenToggle = (checked) => {
    chrome.storage.local.set({ toolbar: { ...toolbar, hidden: checked } }, () => {
      message.success('更新成功')
    })
  }

  useEffect(() => {
    chrome.storage.local.get('toolbar', (value) => {
      setToolbar(get(value, 'toolbar'))
    })

    const onToolbarStorageChanged = (changes) => {
      if ('toolbar' in changes) {
        const storageChange = changes.toolbar
        setTimeout(() => setToolbar(storageChange.newValue), 0)
      }
    }

    chrome.storage.onChanged.addListener(onToolbarStorageChanged)

    return () => {
      chrome.storage.onChanged.removeListener(onToolbarStorageChanged)
    }
  }, [])

  return (
    <div>
      <div className={styles['field-item']}>
        <div>禁用</div>
        <Switch checked={get(toolbar, 'disable')} onChange={onDisableToggle} />
      </div>
      <div className={styles['field-item']}>
        <div>默认收起</div>
        <Switch checked={get(toolbar, 'hidden')} onChange={onHiddenToggle} />
      </div>
    </div>
  )
}

export default Toolbar
