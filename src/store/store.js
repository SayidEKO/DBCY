import {createStore, applyMiddleware} from "redux";
import RootReducer from "./reducers/reducer";
import logger from "redux-logger";
import thunk from "redux-thunk";

export default createStore(RootReducer, applyMiddleware(logger, thunk))

export function addTodo(type, msg) {
  return {type,msg}
}