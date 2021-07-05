/**
 * 是否为空
 * @param {*} object 
 * @returns 
 */
export function isEmpty(object) {
    return object === null || object === undefined || object === '' ? true : false
}

/**
 * 获取对象的值
 * @param {*} object 
 * @returns 
 */
export function getValue(object) {
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
        }else {
            width += stringWidth
        }
    })
    return width
}

/**
 * 格式化数据
 * @param {*} arr 
 * @returns 
 */
export function formatData(arr) {
  const objs = [];
  let obj = {};
  arr.forEach(router => {
    if (router.children) {
      router.children = formatData(router.children);
      const { id, name, children } = router;
      obj = {
        value: id,
        label: name,
        children: children
      }
    }
    objs.push(obj);
  })
  return objs;
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