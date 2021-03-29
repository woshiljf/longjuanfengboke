import request from "../utils/request";
// 货品列表,获取所有下拉框可选数据的api接口
export function getHomeLubo() {
    return request({
        url: "api/banner",
        method: "get"
    });
}