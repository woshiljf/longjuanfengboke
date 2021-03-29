const dataStructand = {
    // B2B订单列表页搜索框
    tackAlgorithm: [

        1, 2, 3,



    ],

    dpAlgorithm: [

        {
            "name": "找零钱",
        }



    ],



    // OMS订单列表搜索框
    omsOrderListOptions: [

    ]
}
















// 添加刷新最新默认时间的方法
export const getNewTime = () => {
    // 遍历刷新最新默认时间
    for (const k in searchBarOptions) {
        searchBarOptions[k].map(item => {
            // 如果有默认值属性的,那么就判断为时间组件, 那么给它重新刷新后的值
            if (item.defaultValue) {
                item.defaultValue = [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()]
            }
        })
    }
}
export default dataStructand