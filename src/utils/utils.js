/**
 * 是否为空
 * @param {*} object 
 * @returns 
 */
 export function isEmpty(object) {
  if (object === null || object === undefined) {
    return true
  } else {
    if (Array.isArray(object)) {
      return object.length === 0
    } else if (JSON.stringify(object) === '{}') {
      return true
    }else{
      return object === ''
    }
  }
}

/**
 * 获取对象的id
 * @param {*} object 
 * @returns 
 */
export function getValue(object) {
  if (typeof object.value === 'object') {
    if (!isEmpty(object.value.label) && !isEmpty(object.value.value)) {
      return object.value.value
    }
    return object.value.name === undefined ? '' : object.value.name
  } else {
    return object.value === undefined ? '' : object.value
  }
}

/**
 * 获取对象的名字
 * @param {*} object 
 * @returns 
 */
export function getLabel(object) {
  if (typeof object.value === 'object') {
    if (!isEmpty(object.value.label) && !isEmpty(object.value.value)) {
      return object.value.label
    }
    return object.value.name === undefined ? '' : object.value.name
  } else {
    return object.value === undefined ? '' : object.value
  }
}

/**
 * 格式化时间
 * @param {*} format 
 * @param {*} date 
 */
export function getFormatDate(format, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(format);
    if (ret) {
      format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return format;
}

/**
 * 计算字符宽度
 * @param {字符串} value 
 * @returns 
 */
export function countStringWidth(value) {
  let stringWidth = 20
  let numberWidth = 10
  let width = 0
  //拆分字符串
  let chars = value.split('')
  chars.forEach(char => {
    if (!isNaN(Number(char))) {
      width += numberWidth
    } else {
      width += stringWidth
    }
  })
  return width
}


/**
 * 获取数组深度
 * @param {数组} arr 
 * @param {初始值} depth 
 * @returns 
 */
export function getDeep(arr, depth) {
  var flag = false;
  var temp = [];
  if (arr === undefined) {
    return 1
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children instanceof Array) { // 判断是否是数组
      for (let j = 0; j < arr[i].children.length; j++) {
        temp.push(arr[i].children[j]); // 解析出arr下第一层
      }
      flag = true;
    }
  }
  if (flag) { // 如果还有数组，则继续解析，直到最后一层有不为数组为止
    depth++;
    return getDeep(temp, depth);
  } else {
    return depth;
  }
}

/**
 * 检查数据
 * @param {*} dataSource 
 * @param {*} head 
 * @param {*} bodys 
 * @returns true没有错误
 */
export function checkData(dataSource, head, bodys) {
  //检查数据
  let isOk = true

  dataSource.forEach(table => {
    if (table.yqpx === '1') {
      table.yqdata.forEach(item => {
        let value = getValue(item)
        //没有值则不传该字段，
        if (isEmpty(value)) {
          if (item.required === 'Y') {
            item.hasError = true
            isOk = false
          }
        } else {
          //新增不传billno
          if (item.code !== 'billno') {
            head[item.code] = value
          }
        }
      })
    } else {
      //存单张表
      let objs = []
      //遍历子表每一条数据
      table.yqdata.forEach(items => {
        //存单条数据
        let obj = {}
        //遍历表每一个字段
        items.forEach(item => {
          let value = getValue(item)
          //没有值则不传该字段，
          if (isEmpty(value)) {
            if (item.required === 'Y') {
              item.hasError = true
              isOk = false
            }
          } else {
            //新增不传billno
            if (item.code !== 'billno') {
              obj[item.code] = value
            }
          }
        })
        objs.push(obj)
      })
      if (objs.length > 0) {
        bodys[table.code] = objs
      }
    }
  })
  return isOk
}

/**
 * 获取人（需要添加部门）
 * @param {*} data 
 * @param {*} checkUserData 
 */
export function getUserData(data, checkUserData) {
  let obj = {}
  data.forEach(item => {
    if (item.psndoc === undefined) {
      getUserData(item.children, checkUserData)
    } else {
      item.psndoc.forEach(v => {
        obj = {
          value: v.cuserid,
          label: v.name
        }
        checkUserData.push(obj)
      })
    }
  })
}

//  export function getDepartment(arr) {
//   const objs = [];
//   let obj = {};
//   arr.forEach(router => {
//     if (router.children) {
//       router.children = getDepartment(router.children);
//       const { id, name, children, psndoc } = router;
//       obj = {
//         value: id,
//         label: name,
//         psndoc: psndoc,
//         children: children
//       }
//     }
//     objs.push(obj);
//   })
//   return objs;
// }

/**
 * 获取部门
 * @param {*} arr 
 * @returns 
 */
export function getDepartment(arr) {
  const objs = [];
  let obj = {};
  arr.forEach(router => {
    if (router.children) {
      if (router.psndoc && router.psndoc.length > 0) {
        let objs = []
        router.psndoc.forEach(item => {
          let obj = {
            value: item.cuserid,
            label: item.name
          }
          objs.push(obj)
        })
        router.children = objs
      } else {
        router.children = getDepartment(router.children);
      }

      const { id, name, children, psndoc } = router;
      obj = {
        value: id,
        label: name,
        psndoc: psndoc,
        children: children
      }
    }
    objs.push(obj);
  })
  return objs;
}
