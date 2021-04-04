import request from "@/utils/request";
import {get } from "@/utils/request";

export function loginByUsername(username, password) {
    const data = {
        phone: username,
        password: password
    };
    return request({
        url: "api/login/cellphone",
        method: "get",
        params: data
    });
}

export function loginByEmailname(username, password) {
    const data = {
        phone: username,
        password: password
    };
    return request({
        url: "api/login",
        method: "get",
        params: data
    });
}

export function geterWeiMaKey() {

    // 加上时间戳，防止走缓存
    var time = new Date().getTime()
    return request({
        url: "api/login/qr/key?time=" + time,
        method: "get",
    });
}

// 获取二维码/login/qr/check
export function getErWeiMaImg(key) {
    const data = {
        key: key,
        qrimg: true,
        time: new Date().getTime()
    };
    return request({
        url: "api/login/qr/create",
        method: "get",
        params: data
    });
}
// 轮询查看二维码接口状态
export function LoginCheckQrState(key) {
    const data = {
        key: key,
        time: new Date().getTime()
    };
    return request({
        url: "api/login/qr/check",
        method: "get",
        params: data
    });
}



// export

export function logout() {
    const data = {
        systemId: 10
    };
    return request({
        url: "api/logout",
        method: "post",
        data
    });
}