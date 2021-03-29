import * as types from '../mutation-types.js'

//全局状态
const state = {
    username: '',
    password: '',
    tabData: [],
    treeData: [],
    playStats: false
}

//getters 
const getters = {
    username: state => {
        return state.username
    },
    password: state => {
        return state.password
    },
    tabData: state => {
        return state.tabData
    },
    treeData: state => {
        return state.treeData
    },
    playStats: state => {
        return state.playStats
    },
}

const mutations = {
    [types.SET_USERNAME](state, username) {
        state.username = username
    },
    [types.SET_PASSWORD](state, password) {
        state.password = password
    },
    [types.SET_TABDATA](state, tabData) {
        state.tabData = tabData
    },
    [types.SET_TREEDTA](state, treeData) {
        state.treeData = treeData
    },
    [types.SET_PLAYSTATS](state, playStats) {
        state.playStats = playStats
    },
}

export default {
    state,
    mutations,
    getters
}