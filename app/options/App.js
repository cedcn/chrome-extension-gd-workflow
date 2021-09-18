import React, { useState } from 'react'
import { map, isString, forEach, cloneDeep } from 'lodash'
import { Input, Form, Button, message, PageHeader, Tabs } from 'antd'
import Actions from './Actions'
import Toolbar from './Toolbar'
import styles from './app.module.css'

const { TabPane } = Tabs
const { TextArea } = Input

const labels = {
  names: '姓名',
  texts: '单行文本',
  textAreas: '多行文本',
  links: '网址',
  telephones: '手机号吗',
  mobiles: '电话号码',
  emails: '邮箱',
  times: '时间',
  dates: '日期',
}

let data = []
const KEYS = ['names', 'links', 'texts', 'textAreas', 'telephones', 'mobiles', 'emails', 'times', 'dates']
chrome.storage.local.get('filler', (value) => {
  data = value.filler
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
          <TabPane tab="Toolbar Setting" key="Toolbar Setting">
            <Toolbar />
          </TabPane>
          <TabPane tab="Filler Setting" key="Filler Setting">
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

                chrome.storage.local.set({ filler: newValues }, () => {
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
