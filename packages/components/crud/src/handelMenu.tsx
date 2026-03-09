import { ElButton, ElIcon, ElPopover } from 'element-plus'
import { More } from '@element-plus/icons-vue'
import { useLocale } from '@cjx-low-code/hooks'
import { hasPermi } from './hasPermi'
import crudConfig from './config'
import type { AnyObject } from '../../_util/type'
import type { CrudPermission, DialogFormType, Scope, TableOption } from './interface'
import type { VNode, VNodeArrayChildren } from 'vue'

const { MAX_MENU_BTN_COUNT } = crudConfig

export type HandleShowDialogForm = (type: DialogFormType, row?: AnyObject, index?: number) => void

export type RowDeltype = (row: AnyObject, index: number) => void

export const menuBtnVNode = (props: {
  scope: Scope
  permission: CrudPermission
  option: TableOption
  handleShowDialogForm: HandleShowDialogForm
  rowDel: RowDeltype
}) => {
  const { t } = useLocale()
  const { scope, permission, option, handleShowDialogForm, rowDel } = props
  return (
    <>
      {option?.viewBtn && hasPermi(permission?.viewBtn, scope) && (
        <ElButton
          link
          type="primary"
          onClick={() => handleShowDialogForm('check', scope.row, scope.$index)}
        >
          {t('action.check')}
        </ElButton>
      )}
      {option?.updateBtn && hasPermi(permission?.editBtn, scope) && (
        <ElButton
          link
          type="primary"
          onClick={() => handleShowDialogForm('update', scope.row, scope.$index)}
        >
          {t('action.edit')}
        </ElButton>
      )}
      {option?.delBtn && hasPermi(permission?.delBtn, scope) && (
        <ElButton link type="danger" onClick={() => rowDel(scope.row, scope.$index)}>
          {t('action.delete')}
        </ElButton>
      )}
    </>
  )
}

export const getMenuVNode = (menuBtnVNode: VNode, slots: VNode[]) => {
  const defMenuNode = menuBtnVNode.children
    ? (menuBtnVNode.children as VNodeArrayChildren).filter((item) => item)
    : []
  const slotNode = slots.filter((item) => item.type !== Comment)

  if (defMenuNode.length + slotNode.length <= MAX_MENU_BTN_COUNT)
    return (
      <>
        {menuBtnVNode} {slots}
      </>
    )

  if (defMenuNode.length >= MAX_MENU_BTN_COUNT)
    return (
      <>
        {menuBtnVNode}
        <ElPopover
          v-slots={{
            reference: () => (
              <ElIcon size={16} class={'m-l-16px'} color={'var(--el-color-primary)'}>
                <More />
              </ElIcon>
            )
          }}
        >
          <div class={'flex flex-col cjx-crud-popover-btn-group'}>{slots}</div>
        </ElPopover>
      </>
    )

  return (
    <>
      {menuBtnVNode}
      {slotNode.slice(0, MAX_MENU_BTN_COUNT - defMenuNode.length)}
      <ElPopover
        v-slots={{
          reference: () => (
            <ElIcon class={'m-l-16px'} size={16} color={'var(--el-color-primary)'}>
              <More />
            </ElIcon>
          )
        }}
      >
        <div class={'flex flex-col cjx-crud-popover-btn-group'}>
          {slotNode.slice(MAX_MENU_BTN_COUNT - defMenuNode.length, slotNode.length)}
        </div>
      </ElPopover>
    </>
  )
}
