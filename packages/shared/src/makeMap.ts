/**
 * 创建一个映射（Map），并返回一个函数，用于检查某个键是否在该映射中。
 * 重要：所有调用此函数的地方都必须加上 \/\*#\_\_PURE\_\_\*\/ 前缀
 * 这样 rollup 就可以在必要时进行 tree-shake（摇树优化）。
 */
/*! #__NO_SIDE_EFFECTS__ */
export function makeMap(str: string, expectsLowerCase?: boolean): (key: string) => boolean {
  const set = new Set(str.split(','))
  return expectsLowerCase ? (val) => set.has(val.toLowerCase()) : (val) => set.has(val)
}
