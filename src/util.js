const toString = (obj) => Object.prototype.toString.call(obj)

export function isRegExp (obj) {
  return toString(obj) === '[object RegExp]'
}

export function isString (obj) {
  return toString(obj) === '[object String]'
}

export function isArray (obj) {
  return toString(obj) === '[object Array]'
}

export function isFunction (obj) {
  return toString(obj) === '[object Function]'
}

export function isNumber (obj) {
  return toString(obj) === '[object Number]'
}

export function isObject (obj) {
  const type = typeof obj
  return obj != null && type === 'object'
}

export function isEmpty (obj) {
  if (obj == null) return true
  if (typeof obj.length === 'number') return obj.length === 0
  return false
}
