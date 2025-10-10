// import { CACHE_KEY, useCache } from '@cjx-low-code/hooks/web/useCache'

// function hasPermi(value: string[] = ['']) {
//   const { wsCache } = useCache()
//   const all_permission = '*:*:*'
//   const permissions = wsCache.get(CACHE_KEY.USER) ? wsCache.get(CACHE_KEY.USER).permissions : []
//   if (value && value instanceof Array && value.length > 0) {
//     const permissionFlag = value
//     const hasPermissions = permissions.some((permission: string) => {
//       return all_permission === permission || permissionFlag.includes(permission)
//     })

//     return hasPermissions
//   }
// }
 
// export default hasPermi
