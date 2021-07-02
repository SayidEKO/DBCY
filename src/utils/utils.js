
export function isEmpty(object) {
    return object === null || object === undefined || object === '' ? true : false
}

export function getValue(object) {
    if(typeof object.value === 'object') {
        if (Array.isArray(object.value)) {
            return object.value
        }
        return object.value.name === undefined ? '' : object.value.name
    }else {
        return object.value === undefined ? '' : object.value
    }
}