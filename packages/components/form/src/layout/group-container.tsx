import { defineComponent } from 'vue'
import { ElCol, ElRow } from 'element-plus'
import { objectType, someType } from '@cjx-low-code/components/_util/type'
import type { CustomSlotsType } from '@cjx-low-code/components/_util/type'
import type { DialogFormType, GroupInterface } from '../interface'
import type { VNode } from 'vue'

const XGroupContainer = defineComponent({
  name: 'XGroupContainer',
  props: {
    props: objectType<GroupInterface>(),
    xBoxType: someType<DialogFormType>()
  },
  slots: Object as CustomSlotsType<{
    default: (scope: { _xBoxType: DialogFormType }) => VNode | undefined
  }>,
  setup(props, { slots }) {
    return () => (
      <ElRow class={['cjx-form-group w-100%', `cjx_${props.props.prop}`]}>
        <ElCol span={24}>
          <div class={'flex flex-items-center m-b-10px justify-between'}>
            <div class={'flex flex-items-center is-guttered w-100%'}>
              <span class={'w-4px h-14px bg-[var(--el-color-primary)] m-r-8px'}></span>
              <div
                class={
                  'color-[var(--cjx-dialog-title-color)] font-500 font-size-14px w-[calc(100%-12px)]'
                }
              >
                {props.props.label}
              </div>
            </div>
          </div>
        </ElCol>
        {slots.default && slots.default?.({ _xBoxType: props.xBoxType })}
      </ElRow>
    )
  }
})

export default XGroupContainer
