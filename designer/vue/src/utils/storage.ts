export interface ICache {
  setItem(key: string, value: any): void
  getItem(key: string): any
  removeItem(key: string): any
}

export class Storage implements ICache {
  // 是否可以 JSON.parse
  isJson(data: string) {
    try {
      JSON.parse(data)
      return true
    } catch {
      return false
    }
  }

  public setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  public getItem<T>(key: string): T {
    const value = localStorage.getItem(key)
    if (value && value != 'undefined' && value != 'null' && this.isJson(value)) {
      return <T>JSON.parse(value)
    }
    return value as T
  }

  public removeItem(key: string) {
    localStorage.removeItem(key)
  }
}
