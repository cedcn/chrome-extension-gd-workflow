import React, { useState } from 'react'
import { map, isString, forEach, cloneDeep } from 'lodash'
import { Input, Form, Button, message, PageHeader, Tabs } from 'antd'
import Actions from './Actions'
import styles from './app.module.css'

const { TabPane } = Tabs
const { TextArea } = Input

const labels = {
  names: '姓名',
  texts: '单行文本',
  textAreas: '多行文本',
  telephones: '手机号吗',
  mobiles: '电话号码',
  emails: '邮箱',
  timeList: '时间',
  dataList: '日期',
}

const KEYS = ['names', 'texts', 'textAreas', 'telephones', 'mobiles', 'emails', 'timeList', 'dataList']
let data = []
chrome.storage.local.get(KEYS, (value) => {
  data = value
})

const App = () => {
  const [form] = Form.useForm()
  const [subTitle, setSubTitle] = useState('Actions Setting')

  function callback(key) {
    setSubTitle(key)
  }

  return (
    <div>
      <PageHeader className="site-page-header" title="金数据 Workflow" subTitle={subTitle} />
      <div className={styles.container}>
        <Tabs defaultActiveKey="1" onChange={callback} animated={false}>
          <TabPane tab="Actions Setting" key="Actions Setting">
            <Actions />
          </TabPane>
          <TabPane tab="Fill Setting" key="Fill Setting">
            <Form
              form={form}
              initialValues={data}
              layout="vertical"
              onFinish={(values) => {
                const newValues = cloneDeep(values)
                forEach(newValues, (value, key) => {
                  if (isString(value)) {
                    newValues[key] = value.split(',')
                  }
                })

                console.log('newValues', newValues)
                chrome.storage.local.set(newValues, () => {
                  message.success('保存成功')
                })
              }}
            >
              {map(KEYS, (item) => {
                return (
                  <Form.Item key={item} label={labels[item]} name={item}>
                    <TextArea style={{ minHeight: '100px' }} />
                  </Form.Item>
                )
              })}
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default App
