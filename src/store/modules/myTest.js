const MyTest = {
    state: {
        nums: 0,
        name: "小狗",
        love: "篮球",
        playurl: "http://m8.music.126.net/20200910211922/f546fc993b4e26ea0cadb3eac43b1fe3/ymusic/a024/09a7/c4c3/fc0d416790bc729172c636e2d2d1109a.mp3",
        playList: [],
        nowPlayId: 0,
        playButtonIndex: 0,
        playbarshowOrHidden: true,
        playListId: 0,
        prePlayListId: 0, //记录前一个歌单id,
        searchOutCome: null,
        searchInfo: {},
        stronger: false,
        navFlag: true,
        singId: 0, // 歌曲id
        singerDetail: {},
        playListData: []

    },

    // mutations 主要的作用是对state的状态进行修改的,不能直接修改state的属性值
    mutations: {
        addNums(state, n) {
            state.nums += n;
        },

        changeName(state, name) {
            state.name = name;
        },

        changeLove(state, love) {
            state.love = love;
        },
        changePlayurl(state, url) {
            state.playurl = url;
        },
        changePlayList(state, list) {
            state.playList = list;
        },
        changeNowPlayId(state, id) {
            state.nowPlayId = id;
        },
        changePlayButtonIndex(state, id) {
            state.playButtonIndex = id;
        },
        changeShowOrHidden(state, f) {
            state.playbarshowOrHidden = f
        },
        changePlayListId(state, sid) {
            state.playListId = sid;
        },
        changePrePlayListId(state, sId) {
            state.prePlayListId = sId;
        },
        changeSearchOutCome(state, outcome) {
            state.searchOutCome = outcome
        },
        changeSearchInfo(state, outcome) {

            state.searchInfo = outcome
        },
        changeStronger(state, f) {
            state.stronger = f
        },

        changeNavFlag(state, f) {
            state.navFlag = f
        },
        commitSingId(state, id) {
            state.singId = id
        },
        changeSingerInfo(state, data) {
            state.singerDetail = data
        },
        changePlayListCatgory(state, data) {
            state.playListData = data
        }

    },
    // 主要处理一些异步请求，请求回来的数据，重新改变state的属性，在经过mutations来改变
    actions: {
        // 函数的第一个变量维context
        changeNumsTime(context, playLoad) {
            setTimeout(() => {
                context.commit("addNums", playLoad.num);
            }, 3000);
        },
        changeNameTime({ commit, state }, name) {
            console.log("这是state实例吗", commit);

            setTimeout(() => {
                commit("changeName", name);
            }, 3000);
        }
    },

    //相当于vue中的computed，主要是响应数据，在数据被使用时，做一层包装，或者过滤
    getters: {
        nameLove2: function(state, getters, rootState) {
            console.log("我是根节点的状态", rootState);
            return state.nums + "喜欢" + state.love;
        },

        // 可以使得getters返回一个函数

        getMoneny: state => n => {
            return state.name + "有" + n + "这么多钱";
        }
    }
};

export default MyTest;