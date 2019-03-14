import axios from 'axios'
import config from '@/config'
import Qs from 'qs';
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const ajax = axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    transformRequest: [function(data) {
        data = Qs.stringify(data)
        return data
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
export default ajax