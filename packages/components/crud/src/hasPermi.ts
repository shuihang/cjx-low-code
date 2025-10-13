import { isFunction } from '../../_util/shared'
import type { PermissionMenBtnType, Scope } from './interface'

export function hasPermi(permission: PermissionMenBtnType | undefined, scope: Scope) {
  if (isFunction(permission)) {
    return permission(scope)
  }

  if (!permission) return true

  return permission.value || true
}