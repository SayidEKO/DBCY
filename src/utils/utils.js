
export function isEmpty(object) {
    return object === null || object === undefined || object === '' ? true : false
}

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

//计算字符宽度
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