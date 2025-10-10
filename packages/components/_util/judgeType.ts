// 是否为对象
export function isObject(data: any) {
  return Object.prototype.toString.call(data) === '[object Object]'
}
