import request from '@/utils/request'

// FCS补偿推送恒康
export function fcsCompensateHk(data){
  return request({
    url: '/bff/api/v1/operation/sync/pos/syncB2cSaleAndPo',
    method: 'post',
    data
  })
}
// FCS订单补偿处理
export function fcsOrderCompensateHandle(data){
  return request({
    url: '/bff/api/v1/operation/sync/pos/syncOrder',
    method: 'post',
    data
  })
}
