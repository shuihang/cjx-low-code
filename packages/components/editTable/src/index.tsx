import { computed, defineComponent, ref } from 'vue'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import XCrud from '../../crud' // 移除循环依赖
import { ElButton, ElFormItem, ElIcon, ElTooltip } from 'element-plus'
import pick from '../../_util/pick'
import { useLocale } from '@cjx-low-code/hooks'
import { editTableMapProps, editTableProps } from './interface'
import type { CustomSlotsType } from '../../_util/type'
import { withInstallVue } from '../../_util/type'
import type { EditTableOption, Placement } from './interface'
import type { SortableEvent } from 'sortablejs'
import type {
  Scope,
  TableOption,
} from '../../crud/src/interface'
import type { ComputedRef, VNode } from 'vue'

const editTableEmits = {
  'update:modelValue': (data: any[]) => true,
  /** 点击新增按钮触发的事件 */
  addChange: (row: any, index: number) => true,
  delChange: (row: any, index: number) => true,
  /** 点击复制按钮触发的事件 */
  copyChange: (row: any, index: number) => true,
  sortableChange: (sortable: SortableEvent) => true,
}

export const XEditTable = withInstallVue(defineComponent({
  name: 'XEditTable',
  inheritAttrs: false,
  props: editTableProps(),
  emits: editTableEmits,
  slots: Object as CustomSlotsType<
    {
      /** 操作栏插槽 */
      menu?: Scope
    } & {
      [key: string]: {
        /** 表格行数据 */
        row: any
        /** 表格行索引 */
        $index: number
      }
    }
  >,
  setup: (props, { slots, emit }) => {
    const { t } = useLocale()

    const { isView = false } = props
    const option = props.option
    const {
      sortable = false,
      delBtn = false,
      border = false,
      index = false,
    } = option

    // const data = ref<any[]>([...props.modelValue])

    const keys: any = {}

    const tableOption = ref<TableOption>({
      isCard: false,
      menuHeaderRight: false,
      menu: !isView,
      menuWidth: 150,
      sortable,
      delBtn,
      border,
      index,
      column: [],
    })

    const onUpdateModelValue = (v: any) => {
      //data.value[index][key] = v
      // emit('update:modelValue', data.value)
    }

    const addChange = () => {
      // data.value.push({...keys})
      if (props.modelValue) {
        emit('update:modelValue', [...props.modelValue, { ...keys }])
      } else {
        emit('update:modelValue', [{ ...keys }])
      }

      emit('addChange', { ...keys }, props.modelValue.length)
    }

    const rowDel = (row: typeof keys, index: number) => {
      // data.value.splice(index, 1)
      const newModelValue = props.modelValue?.filter((_, i) => i !== index)
      emit('update:modelValue', newModelValue)

      emit('delChange', row, index)
    }

    const copyChange = (row: typeof keys, index: number) => {
      const newRow = JSON.parse(JSON.stringify(row))
      delete newRow[props.option.rowKey || 'id']
      // console.log(newRow, props.option.rowKey)

      const newModelValue = props.modelValue

      newModelValue.splice(index + 1, 0, newRow)
      emit('update:modelValue', newModelValue)

      emit('copyChange', row, index)
    }

    const getLabelNode = (
      tip: string | undefined,
      label: string | VNode,
      placement: Placement
    ): VNode => {
      if (tip) {
        return (
          <ElTooltip placement={placement} content={tip}>
            {label}
          </ElTooltip>
        )
      } else {
        return <div>{label}</div>
      }
    }

    const getSlots: ComputedRef<{ [x: string]: (...args: any[]) => VNode }> =
      computed(() => {
        const vNode: { [k in string]: (data: Scope) => VNode } = {}

        if (option?.copyBtn) {
          vNode['menu'] = ({ row, $index }) => (
            <>
              {slots.menu?.({ row, $index })}
              <ElButton
                type="primary"
                link
                onClick={() => copyChange(row, $index)}
              >
                {t('common.copy')}
              </ElButton>
            </>
          )
        } else {
          vNode['menu'] = ({ row, $index }) => (
            <>{slots.menu?.({ row, $index })}</>
          )
        }

        ;[''].map(() => {
          tableOption.value.column = []
        })

        // tableOption.value.column = []
        const opt = props.option as EditTableOption
        // @ts-ignore
        opt?.column?.forEach((item) => {
          const {
            label,
            prop,
            type,
            rules,
            hide = false,
            dicData,
            tip,
            tipPlacement = 'top',
          } = item

          keys[prop] = editTableMapProps[type]?.defaultValue

          const hideFn = typeof hide === 'boolean' ? computed(() => hide) : hide

          !hideFn.value &&
            tableOption.value.column?.push({
              prop,
              label: (() => {
                let newLabel: VNode = getLabelNode(
                  tip,
                  <>
                    {label}
                    {tip && (
                      <ElIcon size={14} style={{ marginLeft: '5px' }}>
                        <QuestionFilled />
                      </ElIcon>
                    )}
                  </>,
                  tipPlacement
                )

                rules?.forEach((rule) => {
                  if ((rule as any).required) {
                    newLabel = getLabelNode(
                      tip,
                      <div class={'flex flex-items-center'}>
                        <span
                          class={'color-red m-r-3px h-9px line-height-100%'}
                        >
                          *
                        </span>
                        {label}
                        {tip && (
                          <ElIcon size={14} style={{ marginLeft: '5px' }}>
                            <QuestionFilled />
                          </ElIcon>
                        )}
                      </div>,
                      tipPlacement
                    )
                  }
                })
                return newLabel
              })(),
              ...pick(item, ['width', 'minWidth', 'dicData']),
              slot: !isView,
            })

          const Component = editTableMapProps[type].components as any
          const SubComponents = editTableMapProps[type]?.subComponents as any

          vNode[prop] = ({ $index, row }) => {
            // console.log('editTable', $index, data.value, props.modelValue)
            return (
              <div>
                {!slots[prop] ? (
                  <ElFormItem
                    prop={`${props.prop}${$index}.${prop}`}
                    rules={rules}
                    class={'p-t-13px p-b-13px'}
                  >
                    <Component
                      v-model={props.modelValue![$index]![prop]}
                      onUpdate:modelValue={onUpdateModelValue}
                      placeholder={editTableMapProps[type].placeholder + label}
                      type={editTableMapProps[type].type}
                      {...item[type]}
                      {...item?.on}
                    >
                      {dicData &&
                        SubComponents &&
                        dicData.map((item) => (
                          <SubComponents
                            key={item.value}
                            label={item.label}
                            value={item.value}
                          />
                        ))}
                    </Component>
                  </ElFormItem>
                ) : (
                  slots[prop]?.({ $index, row })
                )}
              </div>
            )
          }
        })
        return vNode
      })

    return () => {
      // console.log(1111, tableOption.value)

      return (
        <div class={'cjx-edit-table w-100%'}>
          <XCrud
            class={'w-100%'}
            option={tableOption.value}
            data={props.modelValue}
            onRowDel={rowDel}
            v-slots={getSlots.value}
            onSortableChange={(sortable: SortableEvent) =>
              emit('sortableChange', sortable)
            }
            cellClassName={() => 'handle'}
          />

          {!props.isView && (
            <div class={['w-100% flex justify-center mt-10px']}>
              <ElButton onClick={addChange} type="primary" link>
                <ElIcon>
                  <Plus />
                </ElIcon>
                { t('table.add_a_row') }
              </ElButton>
            </div>
          )}
        </div>
      )
    }
  },
}))

export default XEditTable
