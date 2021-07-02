import { combineReducers } from "redux";

import { UserReducer } from "./userReducer";
import { ListReducer } from "./listReducer";
import { DetailReducer } from "./detailReducer";

const RootReducer = combineReducers({
  userModule: UserReducer,
  listModule: ListReducer,
  detailModule: DetailReducer,
})

export default RootReducer