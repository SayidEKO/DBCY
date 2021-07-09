let defaultState = {
    //原始数据
    baseDataSource: [],
    //组合用于显示的数据
    dataSource: [],
    //表的数据
    table: null,
}

export const DetailReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_DETAIL_BaseDataSource':
            return { ...state, baseDataSource: action.msg };
        case 'SET_DETAIL_DataSource':
            return { ...state, dataSource: action.msg };
        case 'SET_DETAIL_Table':
            return { ...state, table: action.msg };
        default:
            return { ...state };
    }
}