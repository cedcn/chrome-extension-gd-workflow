import { generateId } from '../../app/utils'

export const initActions = () =>
  new Promise((resolve) => {
    const actions = [
      {
        id: generateId(),
        name: '当前迭代',
        action: {
          type: 'link',
          value:
            // eslint-disable-next-line no-template-curly-in-string
            'https://matrix.jinshuju.co/engineering/jinshuju/goldendata/-/boards/3?scope=all&utf8=%E2%9C%93&state=opened&milestone_title=${m}&label_name[]=ENT',
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
