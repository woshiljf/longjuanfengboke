const tagsRoute = {
    state: {
        routeArr: []
    },
    mutations:{
      // 添加router
      addRouters(state, route) {
        //   防止重复添加route
        var path = route.path
        for (const route of state.routeArr) {
            if(path===route.path){
              return
            }
        }
        state.routeArr.push(route)
      },
      // 退出清空route
      clearRouters(state) {
        state.routeArr = []
      },
    },
}
export default tagsRoute