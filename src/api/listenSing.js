import request from "../utils/request";
// 货品列表,获取所有下拉框可选数据的api接口
export function nowListenMusic(uid) {
    const id = {
        id: uid
    };
    return request({
        url: "/song/url",
        method: "get",
        params: id
    });
}

// simi/playlist?id=167876
// 获取相似歌曲曲目的歌单
export function getSimPlayList(id) {
    return request({
        url: "api/simi/playlist",
        method: "get",
        params: id
    });
}

// simi/song?id=167876
export function getSimPlaysings(id) {
    return request({
        url: "api/simi/song",
        method: "get",
        params: id
    });
}

// 专辑
export function getalubmInfo(id) {
    return request({
        url: "api/album",
        method: "get",
        params: id
    });
}

// 评论歌曲
// /comment
/**
 * 
 * @param {*} info 
 * 
 * id : 资源 id

tpye: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型

0: 歌曲

1: mv

2: 歌单

3: 专辑

4: 电台

5: 视频
6： 动态
 */
export function submitComment(info) {
    var obj = {
        t: 1,
        type: 0,
        id: 0,
        content: ""
    };
    obj = Object.assign(obj, info);
    return request({
        url: "api/comment",
        method: "get",
        params: obj
    });
}
// 获取专辑评论/comment/album

export function getCommentAlbum(id) {
    var obj = {
        id
    };

    return request({
        url: "api/comment/album",
        method: "get",
        params: obj
    });
}