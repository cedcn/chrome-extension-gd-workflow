import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { quickLook } from '../utils'
import styles from './index.module.css'

const Popup = () => {
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    quickLook('md8S6J', (resData) => {
      setIsLoading(false)
      setContent(resData)
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
