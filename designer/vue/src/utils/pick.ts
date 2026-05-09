function pick<T extends object, K extends keyof T>(obj: T, fields: K[] | readonly K[]): Pick<T, K> {
  const shallowCopy = {} as T
  for (const key of fields) {
    shallowCopy[key] = obj[key]
  }
  return shallowCopy
}
export default pick
