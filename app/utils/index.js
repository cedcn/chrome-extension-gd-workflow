import floor from 'lodash/floor'
import map from 'lodash/map'
import { message } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'

require('dayjs/locale/zh-cn')
const duration = require('dayjs/plugin/duration')
const weekday = require('dayjs/plugin/weekday')

dayjs.extend(weekday)
dayjs.extend(duration)

dayjs.locale('zh-cn')

export const getCurrentMileStoneStr = (offset = 0) => {
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const startDay = dayjs('2018-05-07T00:00:00.000Z')
  let currentDay = dayjs()
  if (offset !== 0) {
    currentDay = currentDay.add(offset, 'week')
  }
  const d = currentDay.diff(startDay, 'day')

  const bigId = floor(d / 7)
  const startWeekDay = currentDay.weekday(0)
  const endWeekDay = currentDay.weekday(6)

  const startM = currentDay.weekday(0).month()
  const endM = currentDay.weekday(6).month()
  const startStr = `${MONTHS[startM]}${startWeekDay.format('DD')}`
  const endStr = `${MONTHS[endM]}${endWeekDay.format('DD')}`
  const str = `BIG${bigId}: ${startStr} - ${endStr}`

  return str
}

export const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2)

export const quickLook = (formToken, cb) => {
  chrome.cookies.getAll({ url: 'https://vaultx.jinshuju.net/' }, async (cookie) => {
    const axiosInstance = axios.create({
      baseURL: 'https://vaultx.jinshuju.net/',
      headers: {
        Cookie: map(cookie, (item) => `${item.name}=${item.value}`).join(';'),
      },
    })

    try {
      const response = await axiosInstance.get(`/quick_look/forms/${formToken}`)
      cb(response.data)
    } catch (error) {
      message.error('网络错误')
    }
  })
}
