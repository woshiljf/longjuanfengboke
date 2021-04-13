import Vue from "vue";
import Vuex from "vuex";
import common from "./modules/common";
import tagsRoute from "./modules/tagsRoute";
import user from "./modules/user";

import { getters } from "./getters";

import myTest from "./modules/myTest";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        myName: "小猪佩奇"
    },
    //  使用modules，组装所有的模块
    modules: {
        common,
        tagsRoute,
        user,
        myTest
    },
    getters
});

export default store;