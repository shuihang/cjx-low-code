import { defineComponent, ref } from 'vue'
import { ElRadio, ElRadioGroup, ElTableColumn } from 'element-plus'
import { objectType, omit } from '@cjx-low-code/shared'
import { useLocale } from '../../../../hooks'
import { arraySort, translateStr } from '../../../_util/tool'
import { useCrudInjectKey } from '../context'
import crudConfig from '../config'
import XColumnMenu from './column-menu'
import type { ColumnProps, Scope } from '../../../crud/src/interface'
import type { SetUpInterface } from '../context'
import type { AnyObject, CustomSlotsType } from '@cjx-low-code/shared'

const {
  defaultRowKey,
  indexWidth: defaultIndexWidth,
  selectionWidth: defaultSelectionWidth
} = crudConfig

export type TableColumRef = {
  setRadioCurrent: (v: any) => void
}

export const getValueByPath = (form: Record<string, any>, path: string) => {
  let value = form
  if (!path) return
  if (path?.indexOf('.') === -1) return value[path]

  const pathArray = path.split('.')
  pathArray.forEach((prop, index) => {
    if (!value[prop]) {
      value[prop] = index === pathArray.length - 1 ? '' : {}
    }
    value = value[prop]
  })
  return value
}

const XTableColumn = defineComponent({
  name: 'XTableColumn',
  inheritAttrs: false,
  props: {
    setUpMenu: objectType<SetUpInterface>()
  },
  slots: Object as CustomSlotsType<{
    /* 操作栏插槽 */
    menu?: () => void
  }>,
  emits: ['radioChange'],
  setup(props, { slots, emit, expose }) {
    const { t } = useLocale()

    const {
      column = [],
      index,
      rowKey = defaultRowKey,
      indexWidth = defaultIndexWidth,
      indexText,
      selection,
      radio,
      selectionWidth = defaultSelectionWidth,
      menu,
      reserveSelection = true
    } = useCrudInjectKey().value.option.value

    const radioValue = ref<any>('')
    const radioChange = (v: string | number | boolean, row: AnyObject) => {
      radioValue.value = v
      emit('radioChange', row)
    }

    const setRadioCurrent = (id: string | number | boolean) => {
      radioValue.value = id
    }

    const dicDataMap = ref<AnyObject>({})

    expose({
      setRadioCurrent
    })
    return () => (
      <>
        {/* 选择框 */}
        {selection && props.setUpMenu?.selection && (
          <ElTableColumn
            type="selection"
            fixed="left"
            align="center"
            reserve-selection={reserveSelection}
            width={selectionWidth}
          />
        )}

        {/* 单选 */}
        {radio && (
          <ElTableColumn
            fixed="left"
            align="center"
            width={selectionWidth}
            v-slots={{
              default: ({ row }: AnyObject) => (
                <ElRadioGroup
                  v-model={radioValue.value}
                  class="w-100%"
                  onChange={(v: string | number | boolean | undefined) =>
                    radioChange(v as string | number, row)
                  }
                >
                  <ElRadio value={row[rowKey]} label={row[rowKey]}>
                    {' '}
                  </ElRadio>
                </ElRadioGroup>
              )
            }}
          />
        )}

        {/* 序号 */}
        {index && props.setUpMenu?.index && (
          <ElTableColumn
            class-name={'font-size-14px'}
            fixed="left"
            type="index"
            align="center"
            width={indexWidth}
            label={indexText || t('table.index')}
          />
        )}

        {arraySort<ColumnProps, 'order'>(
          column as ColumnProps[],
          'order',
          async (item: ColumnProps) => {
            if (!dicDataMap.value[item.prop]) {
              const dicData = item.dicAjaxResolve ? await item.dicAjaxResolve : item.dicData
              dicDataMap.value[item.prop] = dicData
            }
          }
        ).map((item, index) => {
          return (
            !item.hide &&
            !item.setUpHide && (
              <ElTableColumn
                class-name={'font-size-14px'}
                key={index}
                formatter={(row: AnyObject) => {
                  return dicDataMap.value[item.prop]
                    ? translateStr(
                        getValueByPath(row, item.prop),
                        dicDataMap.value[item.prop],
                        item.props
                      )
                    : getValueByPath(row, item.prop)
                }}
                v-slots={{
                  header: () => item.label,
                  default: (scope: Scope) =>
                    (slots as CustomSlotsType<{ default?: (scope: Scope) => void }>)[item.prop] &&
                    (slots as CustomSlotsType<{ default?: (scope: Scope) => void }>)[item.prop](
                      scope
                    )
                }}
                {...omit(item as ColumnProps, ['label'])}
              ></ElTableColumn>
            )
          )
        })}

        {/* 操作栏 */}
        {menu && <XColumnMenu v-slots={{ default: slots.menu }} />}
      </>
    )
  }
})

export default XTableColumn
