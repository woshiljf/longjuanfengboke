import request from '@/utils/request'

// OMS订单更新接口
export function orderUpdate(data) {
  return request({
    url: '/bff/api/v1/operation/order/update',
    method: 'post',
    data
  })
}
// OMS任务状态更新
export function orderStatusUpdate(data) {
  return request({
    url: '/bff/api/v1/operation/task/update',
    method: 'post',
    data
  })
}
// OMS退货单更新
export function orderReturnUpdate(data) {
  return request({
    url: '/bff/api/v1/operation/return_order/update',
    method: 'post',
    data
  })
}
// OMS订单明细更新
export function orderDetailUpdate(data) {
  return request({
    url:'/bff/api/v1/operation/order/item/update',
    method: 'post',
    data
  })
}
// OMS退货单明细更新
export function orderReturnDetailUpdate(data) {
  return request({
    url:'/bff/api/v1/operation/return_order/item/update',
    method: 'post',
    data
  })
}
