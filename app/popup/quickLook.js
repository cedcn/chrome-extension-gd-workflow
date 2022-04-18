import map from 'lodash/map'
import { message } from 'antd'
import axios from 'axios'

const quickLook = (formToken, cb) => {
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

export default quickLook
