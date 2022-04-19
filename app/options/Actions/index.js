import React, { useState, useEffect } from 'react'
import { map, isArray, get } from 'lodash'
import produce from 'immer'
import { Input, Table, Space, Modal, Form, Select, message } from 'antd'

import getCurrentMileStoneStr from '../../utils/getCurrentMileStoneStr'
import generateId from '../../utils/generateId'
import styles from './index.module.css'

const { TextArea } = Input

const columns = [
  {
    title: '变量名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '符号',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '值',
    dataIndex: 'value',
    key: 'value',
  },
]

const operateRender = (text, record, index) => {
  const Render = () => {
    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [form] = Form.useForm()
    const editAction = () => {
      setVisible(true)
    }

    const handleOk = () => {
      form.validateFields().then((values) => {
        setConfirmLoading(true)

        chrome.storage.local.get('actions', (value) => {
          const nActions = produce(get(value, 'actions'), (draftActions) => {
            // eslint-disable-next-line no-param-reassign
            draftActions[index] = { ...draftActions[index], ...values }
          })

          chrome.storage.local.set({ actions: nActions }, () => {
            setConfirmLoading(false)
            setVisible(false)
            message.success('保存成功')
          })
        })
      })
    }

    const removeAction = () => {
      if (!window.confirm('确认删除')) {
        return
      }

      chrome.storage.local.get('actions', (value) => {
        const nActions = produce(get(value, 'actions'), (draftActions) => {
          // eslint-disable-next-line no-param-reassign
          draftActions.splice(index, 1)
        })

        chrome.storage.local.set({ actions: nActions }, () => {
          setConfirmLoading(false)
          setVisible(false)
          message.success('已删除')
        })
      })
    }

    const handleCancel = () => {
      setVisible(false)
    }

    return (
      <Space size="middle">
        <a onClick={() => editAction()}>编辑</a>
        <a onClick={() => removeAction()}>删除</a>
        <Modal
          title={record.name ? `编辑 - ${record.name}` : '编辑'}
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width={768}
          destroyOnClose
        >
          <Form labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} form={form} initialValues={record}>
            <Form.Item label="名称" name="name" rules={[{ required: true, message: 'Required!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="类型" name={['action', 'type']} rules={[{ required: true, message: 'Required!' }]}>
              <Select>
                <Select.Option value="link">链接</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="值" name={['action', 'value']} rules={[{ required: true, message: 'Required!' }]}>
              <TextArea style={{ minHeight: '100px' }} />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    )
  }

  return <Render />
}

const actionsColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 250,
    render: (self, record) => {
      return (
        <div>
          <a>[{self.type}]</a>
          <span>{self.value}</span>
        </div>
      )
    },
  },
  {
    title: 'Shortcut',
    dataIndex: 'shortcut',
    key: 'shortcut',
  },
  {
    title: '操作',
    key: 'operate',
    render: operateRender,
  },
]

const Actions = () => {
  const [visible, setVisible] = useState(false)
  const [actions, setActions] = useState([])
  const [form] = Form.useForm()

  const addNewAction = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleOk = () => {
    form.validateFields().then((values) => {
      const nActions = produce(actions, (draftActions) => {
        draftActions.push({ ...values, id: generateId() })
      })

      chrome.storage.local.set({ actions: nActions }, () => {
        setVisible(false)
        message.success('创建成功')
      })
    })
  }

  useEffect(() => {
    chrome.storage.local.get('actions', (value) => {
      const nActions = get(value, 'actions')
      if (isArray(nActions)) {
        setActions(nActions)
      }
    })

    const onActionStorageChanged = (changes) => {
      if ('actions' in changes) {
        const storageChange = changes.actions
        setTimeout(() => setActions(storageChange.newValue), 300)
      }
    }

    chrome.storage.onChanged.addListener(onActionStorageChanged)

    return () => {
      chrome.storage.onChanged.removeListener(onActionStorageChanged)
    }
  }, [])

  const dataSource = [
    {
      key: '1',
      name: 'Prev Milestone',
      // eslint-disable-next-line no-template-curly-in-string
      symbol: '${m-1}',
      value: getCurrentMileStoneStr(-1),
    },
    {
      key: '2',
      name: 'Current Milestone',
      // eslint-disable-next-line no-template-curly-in-string
      symbol: '${m}',
      value: getCurrentMileStoneStr(),
    },
    {
      key: '3',
      name: 'Next Milestone',
      // eslint-disable-next-line no-template-curly-in-string
      symbol: '${m+1}',
      value: getCurrentMileStoneStr(1),
    },
  ]

  const actionsDataSource = map(actions, (action) => {
    return {
      key: action.id,
      name: action.name,
      action: action.action,
      shortcut: '-',
      value: '',
    }
  })

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={false} size="small" />
      <br />
      <h4>Actions</h4>
      <Table dataSource={actionsDataSource} columns={actionsColumns} pagination={false} />
      <a className={styles['add-new-action']} onClick={() => addNewAction()}>
        +添加一个Action
      </a>
      <Modal title="Create Action" visible={visible} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
        <Form form={form} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: 'Required!' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="类型"
            name={['action', 'type']}
            initialValue="link"
            rules={[{ required: true, message: 'Required!' }]}
          >
            <Select>
              <Select.Option value="link">链接</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="值" name={['action', 'value']} rules={[{ required: true, message: 'Required!' }]}>
            <TextArea style={{ minHeight: '100px' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Actions
