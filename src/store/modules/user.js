import { logout, loginByUsername } from "@/api/login";
// import { changePassword } from '@/api/user'
import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
    state: {
        user: "myFriend",
        status: "",
        code: "123",
        token: getToken(),
        name: "",
        avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        introduction: "",
        // mock为admin
        roles: [],
        userName: "",
        userId: "",
        roleName: "",
        resourceCode: "",
        setting: {
            articlePlatform: []
        },
        userAvatarUrl: ""
    },

    mutations: {
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_ROLE: (state, role) => {
            state.role = role;
        },
        SET_USERID: (state, userId) => {
            state.userId = userId;
        },
        SET_RESOURCECODE: (state, resourceCode) => {
            state.resourceCode = resourceCode;
        },
        SET_ROLENAME: (state, roleName) => {
            state.roleName = roleName;
        },
        SET_USERAvatarUrl: (state, avatarUrl) => {
            state.userAvatarUrl = avatarUrl;
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({ commit }, userInfo) {
            const username = userInfo.userCode.trim();
            return new Promise((resolve, reject) => {
                loginByUsername(username, userInfo.password)
                    .then(response => {
                        if (response.data.msg) {
                            resolve(response);
                        }
                        if (response.data.token) {
                            // console.log('用户信息', response);
                            var loginName = response.data.profile.nickname;
                            var userId = response.data.account.id;
                            console.log("dh", response);
                            var userImage = response.data.profile.avatarUrl;
                            sessionStorage.setItem("user", JSON.stringify({ loginName }));

                            sessionStorage.setItem("userId", JSON.stringify({ userId }));
                            sessionStorage.setItem(
                                "userImage",
                                JSON.stringify({ userImage })
                            );

                            commit("SET_USERAvatarUrl", response.data.profile.avatarUrl);
                            commit("SET_USERID", response.data.profile.userId);
                            commit("SET_TOKEN", response.data.token);
                            setToken(response.data.token);

                            // console.log(response, 'cccccc.store.modules.user.settoken')
                            resolve();
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 修改密码
        ChangePassword({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                changePassword(userInfo)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token)
                    .then(response => {
                        if (!response.data) {
                            reject("Verification failed, please login again.");
                        }
                        const data = response.data;
                        if (data.roleCodes) {
                            commit("SET_ROLECODE", data.roleCodes);
                            // commit('SET_ROLES', ['admin', data.roleCode])
                            commit("SET_ROLES", data.roleCodes);
                        } else {
                            reject("getUserInfo role must be not null ");
                        }
                        commit("SET_ROLENAME", data.roleNames);
                        commit("SET_NAME", data.userName);
                        commit("SET_AVATAR", data.avatar);
                        commit("SET_INTRODUCTION", data.introduction);
                        commit("SET_RESOURCECODE", data.resourceCode);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token)
                    .then(() => {
                        commit("SET_TOKEN", "");
                        commit("SET_ROLES", []);
                        commit("SET_ROLE", "");
                        // 登出销毁,移除token
                        removeToken();
                        localStorage.clear();
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit("SET_TOKEN", "");
                removeToken();
                resolve();
            });
        },
        // accessToken 刷新
        UpdateToken({ commit }, token) {
            // console.log(token, 'updateToken')
            return new Promise(resolve => {
                commit("SET_TOKEN", token);
                resolve();
            });
        },
        // 动态修改权限
        ChangeRoles({ commit, dispatch }, role) {
            return new Promise(resolve => {
                commit("SET_TOKEN", role);
                setToken(role);
                getUserInfo(role).then(response => {
                    const data = response.data;
                    commit("SET_ROLES", data.roles);
                    commit("SET_NAME", data.name);
                    commit("SET_AVATAR", data.avatar);
                    commit("SET_RESOURCECODE", data.resourceCode);
                    commit("SET_INTRODUCTION", data.introduction);
                    dispatch("GenerateRoutes", { resource: data.resourceCode }); // 动态修改权限后 重绘侧边菜单
                    resolve();
                });
            });
        }
    }
};

export default user;