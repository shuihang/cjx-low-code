import { defineComponent, ref } from 'vue'
import { ElRadio, ElRadioGroup, ElTableColumn } from 'element-plus'
import { objectType } from '../../../_util/type'
import { arraySort, translateStr } from '../../../_util/tool'
import omit from '../../../_util/omit'
import { useLocale } from '@cjx-low-code/hooks'
import { useCrudInjectKey } from '../context'
import crudConfig from '../config'
import XColumnMenu from './column-menu'
import type {
  ColumnProps,
  Scope,
} from '../../../crud/src/interface'
import type { SetUpInterface } from '../context'
import type { CustomSlotsType } from '../../../_util/type'

const { row_key, index_width, selection_width } = crudConfig

export type TableColumRef = {
  setRadioCurrent: (v: any) => void
}

export const getValueByPath = (form: Record<string, any>, path: string) => {
  let value = form
  if (!path) {
    return
  }
  if (path?.indexOf('.') === -1) {
    return value[path]
  }

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
    setUpMenu: objectType<SetUpInterface>(),
  },
  slots: Object as CustomSlotsType<{
    /* 操作栏插槽 */
    menu?: any
  }>,
  // expose: Object as ExtractDefaultPropTypes<{setRadioCurrent: () => void }>,
  emits: ['radioChange'],
  setup(props, { slots, emit, expose }) {
    const { t } = useLocale()

    const {
      column = [],
      index,
      rowKey = row_key,
      indexWidth = index_width,
      indexText,
      selection,
      radio,
      selectionWidth = selection_width,
      menu,
      reserveSelection = true,
    } = useCrudInjectKey().value.option.value

    const radioValue = ref<any>('')
    const radioChange = (v: any, row: any) => {
      radioValue.value = v
      emit('radioChange', row)
    }

    const setRadioCurrent = (id: any) => {
      radioValue.value = id
    }

    const dicDataMap = ref<{ [key: string]: any }>({})
    // console.log('dicDataMap', dicDataMap.value)

    expose({
      setRadioCurrent,
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
              default: ({ row }: any) => (
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
              ),
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
              const dicData = item.dicAjaxResolve
                ? await item.dicAjaxResolve
                : item.dicData
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
                formatter={(row: any) => {
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
                    (slots as any)[item.prop] &&
                    (slots as any)[item.prop](scope),
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
  },
})

export default XTableColumn
