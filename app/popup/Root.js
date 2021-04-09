import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { quickLook } from '../utils'
import styles from './index.module.css'

const Popup = () => {
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0] || {}
      if (!tab.url) {
        setContent('没有匹配到 URL.')
        setIsLoading(false)
        return
      }

      const matchResult = tab.url.match(/\/f\/([^/?]+)/) || []
      const matchedformToken = matchResult[1]

      if (matchedformToken) {
        quickLook(matchedformToken, (resData) => {
          setIsLoading(false)
          setContent(resData)
        })
      } else {
        setContent('没有匹配到 FormToken.')
        setIsLoading(false)
      }
    })
  }, [])

  return (
    <Spin spinning={isLoading}>
      <div className={styles.container}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Spin>
  )
}

export default Popup
