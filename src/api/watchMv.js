// mv/url?id=5436712

import request from '../utils/request'
// 货品列表,获取所有下拉框可选数据的api接口
export function getMvUrl(uid) {
    const id = {
        id: uid,
        timestamp: Date.parse(new Date())
    }
    return request({
        url: '/mv/url',
        method: 'get',
        params: id
    })
}