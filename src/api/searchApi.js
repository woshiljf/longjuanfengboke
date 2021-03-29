import request from "../utils/request";



// 搜索建议

// /search/suggest

export function getSearchSug(keywords) {
    const k = {
        keywords
    };
    return request({
        url: "api/search/suggest",
        method: "get",
        params: k
    });
}

// 根据单曲，专辑，mv，用户等，全面搜索
// search?keywords= 海阔天空
// type: 1 单曲 10专辑 100歌手  1000歌单  1002用户  1004mv 1006歌词 1009 电台 1014视频(vedio), 1018综合

export function getCloundSearch(keywords) {

    var p = {
        limit: 30,
        type: 1,
        offset: 1 // 分页
    }

    var p1 = Object.assign(p, keywords)
    return request({
        url: "api/search",
        method: "get",
        params: p1
    });
}