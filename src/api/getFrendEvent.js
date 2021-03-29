// event?pagesize=30&lasttime=1556740526369

import request from "../utils/request";

export function getEvent(p) {
    return request({
        url: "api/event",
        method: "get",
        params: p
    });
}

// /comment/event?threadId=A_EV_2_6559519868_32953014
// 获取动态用户的评论

export function getUserComment(p) {
    return request({
        url: "api/comment/event",
        method: "get",
        params: p
    });
}