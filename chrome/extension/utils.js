import { generateId } from '../../app/utils'

export const initActions = () =>
  new Promise((resolve) => {
    const actions = [
      {
        id: generateId(),
        name: '产品迭代 Current',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?milestone_title=${m}&not%5Blabel_name%5D%5B%5D=%E4%B8%BB%E7%BA%BF%E6%94%B9%E7%89%88&not%5Blabel_name%5D%5B%5D=%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%A2%9E%E9%95%BF',
        },
      },
      {
        id: generateId(),
        name: '产品迭代 Next',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?milestone_title=${m+1}&not%5Blabel_name%5D%5B%5D=%E4%B8%BB%E7%BA%BF%E6%94%B9%E7%89%88&not%5Blabel_name%5D%5B%5D=%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%A2%9E%E9%95%BF',
        },
      },
      {
        id: generateId(),
        name: '改版 Current',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?milestone_title=${m}&label_name%5B%5D=%E4%B8%BB%E7%BA%BF%E6%94%B9%E7%89%88',
        },
      },
      {
        id: generateId(),
        name: '改版 Next',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?milestone_title=${m+1}&label_name%5B%5D=%E4%B8%BB%E7%BA%BF%E6%94%B9%E7%89%88',
        },
      },
      {
        id: generateId(),
        name: '移动端增长 Current',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?milestone_title=${m}&label_name%5B%5D=%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%A2%9E%E9%95%BF',
        },
      },
      {
        id: generateId(),
        name: '移动端增长 Next',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?milestone_title=${m+1}&label_name%5B%5D=%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%A2%9E%E9%95%BF',
        },
      },
      {
        id: generateId(),
        name: '质量部 Current',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?milestone_title=${m}&label_name%5B%5D=%E8%B4%A8%E9%87%8F%E9%83%A8',
        },
      },
      {
        id: generateId(),
        name: '质量部 Next',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?milestone_title=${m+1}&label_name%5B%5D=%E8%B4%A8%E9%87%8F%E9%83%A8',
        },
      },
    ]
    chrome.storage.local.set({ actions }, () => {
      resolve(actions)
    })
  })

export const initFiller = () =>
  new Promise((resolve) => {
    const filler = {
      names: ['张涛', '王菊英'],
      texts: ['这是一段文字'],
      mobiles: ['15035089382', '13029876200'],
      telephones: ['0259-689839', '0689-3928322'],
      textAreas: [
        '金数据是人人可用的在线表单工具，帮助用户收集和管理日常工作中的数据',
        '任何行业和岗位的人员，无需特殊技能，都可以方便的创建出符合业务需求的表单',
      ],
      emails: ['1@1.com', 't@qq.com'],
      times: ['22:14', '14:33'],
      dates: ['2019-03-04'],
      links: ['https://jinshuju.net', 'https://baidu.com'],
    }

    chrome.storage.local.set({ filler }, () => {
      resolve(filler)
    })
  })

export const initToolbar = () =>
  new Promise((resolve) => {
    const toolbar = {
      disable: false,
      hidden: false,
    }

    chrome.storage.local.set({ toolbar }, () => {
      resolve(toolbar)
    })
  })
