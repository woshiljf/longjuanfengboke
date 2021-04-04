import request from "../utils/request";

export function getSingerSongs(limit, offset, id) {
    const obj = {
        limit: limit || 50,
        id: id
    };
    return request({
        url: "api/artist/songs",
        method: "get",
        params: obj
    });
}

export function getPlayListCatgary(limit = 50, cat = '华语', offset = 50) {
    const obj = {
        limit: limit || 50,
        cat: cat,
        offset: offset || 50
    };
    return request({
        url: "api/top/playlist",
        method: "get",
        params: obj
    });
}