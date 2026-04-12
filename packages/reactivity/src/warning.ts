export function warn(msg: string, ...args: any[]) {
  console.warn(`[Reactivity warn] ${msg}`, ...args)
}
