let defaultState = {
    //数据源
    dataSource: [],
    table: null,
}

export const DetailReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_DETAIL_DataSource':
            return { ...state, dataSource: action.msg };
        case 'SET_DETAIL_Table':
            return { ...state, table: action.msg };
        default:
            return { ...state };
    }
}