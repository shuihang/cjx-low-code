import { defineComponent, ref } from 'vue'
import { ElCol, ElRow } from 'element-plus'
import { objectType, someType } from '@cjx-low-code/components/_util/type'
import { useFormInjectKey } from '../context'
import { InitFormTemplate } from '../init'
import type { CustomSlotsType } from '@cjx-low-code/components/_util/type'
import type { TableGroupInterface } from '@cjx-low-code/components/crud/src/interface'
import type { DialogFormType, GroupInterface } from '../interface'

const ZtGroupForm = defineComponent({
  name: 'ZtGroupForm',
  props: {
    // form: objectType<Ref<object>>(),
    group: objectType<GroupInterface[]>(),
    xBoxType: someType<DialogFormType>(),
  },
  slots: Object as CustomSlotsType<{}>,
  setup(props, { slots, expose }) {
    const { newForm, isView, labelWidth, ...othersProps } =
      useFormInjectKey().value

    /** 是否全部展开 */
    const allCollapseStatus = ref<boolean | undefined>(undefined)

    /**
     * 控制全部展开或者全部折叠的方法
     * @param v true/全部展开 false/全部折叠 默认undefined/不控制
     */
    const collapseAllChange = (v: boolean) => {
      allCollapseStatus.value = v
    }

    expose({
      collapseAllChange,
    })

    return () => (
      <>
        {props.group?.map((item, index) => {
          // 不显示任何东西
          const groupFormSlotKey = `${item.prop}GroupForm`
          if (
            ((!(slots[groupFormSlotKey as keyof typeof slots] as any)?.({
              _xBoxType: props.xBoxType,
            })) || !item.column?.length)
          ) return 

          const groupDisplay = item!.display as TableGroupInterface['display']
          // 不显示任何东西
          if (groupDisplay && !groupDisplay({
            form: newForm.value,
            column: item.column || [],
            _xBoxType: props.xBoxType
          })) return <></>

          const {
            collapse = false,
            checkColumnSpan,
            isView: groupIsView = isView.value,
            labelWidth: groupLabelWidth = labelWidth,
          } = item
          /** 默认折叠 */
          const collapseStatus = ref<boolean>(
            allCollapseStatus.value != undefined
              ? allCollapseStatus.value
              : collapse
          )
          const collapseChange = () => {
            collapseStatus.value = !collapseStatus.value
          }

          return (
            <ElRow class={['cjx-form-group w-100%', `zt_${item.prop}`]}>
              <ElCol span={24} key={index}>
                <div class={'flex flex-items-center m-b-10px justify-between'}>
                  <div class={'flex flex-items-center is-guttered w-100%'}>
                    {item.label && (
                      <span
                        class={
                          'w-4px h-14px bg-[var(--el-color-primary)] m-r-8px'
                        }
                      ></span>
                    )}
                    <div
                      class={
                        'color-[var(--cjx-dialog-title-color)] font-500 font-size-14px w-[calc(100%-12px)]'
                      }
                    >
                      {(slots[
                        `${item.prop}GroupLabel` as keyof typeof slots
                      ] as any)
                        ? (
                            slots[
                              `${item.prop}GroupLabel` as keyof typeof slots
                            ] as any
                          )?.({ _XBoxType: props.xBoxType })
                        : item.label}
                    </div>
                  </div>

                  {collapse && (
                    <div
                      class="el-button el-button--primary el-button--default"
                      onClick={collapseChange}
                    >
                      {collapseStatus.value ? '展开' : '折叠'}
                    </div>
                  )}
                </div>
              </ElCol>
              {slots[`${item.prop}GroupForm` as keyof typeof slots] ? (
                <div class={'w-[calc(100%-10px)] m-r--10px m-b-20px'}>
                  {(
                    slots[`${item.prop}GroupForm` as keyof typeof slots] as any
                  )?.({ _XBoxType: props.xBoxType })}
                </div>
              ) : (
                <>
                  {item.column &&
                    InitFormTemplate({
                      column: item.column,
                      newForm: (newForm?.value as any[])?.[index]
                        ? ref((newForm?.value as any[])[index])
                        : newForm,
                      slots,
                      collapseStatus,
                      checkColumnSpan,
                      $index: index,
                      labelWidth: groupLabelWidth,
                      isView: groupIsView,
                      ...othersProps,
                    })}
                </>
              )}
            </ElRow>
          )
        })}
      </>
    )
  },
})

export default ZtGroupForm
