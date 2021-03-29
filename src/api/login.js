import request from "@/utils/request";
import {get } from "@/utils/request";

export function loginByUsername(username, password) {
    const data = {
        phone: username,
        password: password
    };
    return request({
        url: "api/login/cellphone/login/cellphone",
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