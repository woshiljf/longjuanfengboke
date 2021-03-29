import request from "../utils/request";

export function getMyVedio() {
    return request({
        url: "api/mv/sublist",
        method: "get"
    });
}

// mv播放地址
// /mv/url

export function playMv(mvId) {
    var obj = {
        id: mvId
    };
    return request({
        url: "api/mv/url",
        method: "get",
        params: obj
    });
}

// 相似Mv /simi/mv?mvid=5436712
export function simiMv(mvId) {
    var obj = {
        mvid: mvId
    };
    return request({
        url: "api/simi/mv",
        method: "get",
        params: obj
    });
}

// mv评论/comment/mv?id=5436712

export function getMvComment(mvId) {
    var obj = {
        id: mvId
    };
    return request({
        url: "api/comment/mv",
        method: "get",
        params: obj
    });
}

// /related/allvideo?id=89ADDE33C0AAE8EC14B99F6750DB954D
// 相关视频
export function getRelatedMv(mvId) {
    var obj = {
        id: mvId
    };
    return request({
        url: "api/related/allvideo",
        method: "get",
        params: obj
    });
}

//  video详情
// /video/detail?id=3B7F263FCCD01FE0C009C7EFFF38A1E0
export function getMvDetail(mvId) {
    var obj = {
        id: mvId
    };
    return request({
        url: "api/video/detail",
        method: "get",
        params: obj
    });
}

// /comment/video?id=89ADDE33C0AAE8EC14B99F6750DB954D

export function getVedioComment(mvId) {
    var obj = {
        id: mvId
    };
    return request({
        url: "api/comment/video",
        method: "get",
        params: obj
    });
}