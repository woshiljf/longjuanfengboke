import {fetch, fetchapi, baseUrl} from 'config/index.js'
/**
 * δΌεη»ι
 * @param params
 * @returns {*}
 */
export function loginUserNo(params) {
  return fetch(`${baseUrl}/api/declare/login?userName=${params.userName}&password=${params.password}`, params)
}