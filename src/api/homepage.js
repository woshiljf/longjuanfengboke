import request from "../utils/request";
// 货品列表,获取所有下拉框可选数据的api接口
export function getHomePage() {
    return request({
        url: "api/homepage/block/page",
        method: "get"
    });
}

// personalized
export function gerPersona() {
    return request({
        url: "api/personalized",
        method: "get"
    });
}

// 首页榜单请求

// top/list?idx=0

export function getTop(id) {
    return request({
        url: "api/top/list",
        method: "get",
        params: {
            idx: id
        }
    });
}

// 新碟上架top/album?limit=10&offset=0

export function getNewAlbum(limit, offset) {
    const obj = {
        limit: limit,
        offset: offset
    };
    return request({
        url: "api/top/album",
        method: "get",
        params: obj
    });
}