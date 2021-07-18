/**
 * 处理自定义跳转
 */

import { menus } from "../config";
import { router2new, router2work } from "./routers";
import { isEmpty } from "./utils";

export default function custom(that, params) {
  if (isEmpty(params)) {
    router2work(that)
  }else {
    let bodys = menus['人员管理'].child
    bodys.forEach(body => {
      if (body.title === '招聘需求申请') {
        router2new(that, body)
      }
    })
  }
}