// http://3362u865n6.zicp.vip/user/playlist?uid=48693483

import request from "../utils/request";
// 货品列表,获取所有下拉框可选数据的api接口
export function getuserplaylist(uid) {
    const userId = {
        uid: uid
    };
    return request({
        url: "api/user/playlist",
        method: "get",
        params: userId
    });
}

// /user/subcount 获取用户的资料信息

export function getUserInfo() {

    return request({
        url: "api/user/subcount",
        method: "get",
    });
}