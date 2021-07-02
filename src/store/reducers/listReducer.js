let defaultState = {
    //记录tab下标(从详情页面返回到列表再显示)(0:)
    flag: 0,
    //开始时间
    startTime: new Date(Date.now()),
    //结束时间
    endTime: new Date(Date.now())
}

export const ListReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_LIST_FLAG':
            return { ...state, flag: action.msg };
        case 'SET_LIST_STARTTIME':
            return { ...state, startTime: action.msg };
        case 'SET_LIST_ENDTIME':
            return { ...state, endTime: action.msg };
        default:
            return { ...state };
    }
}