import { defineComponent, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { ElButton, ElCol } from 'element-plus'
import type { FormColumnProps } from 'cjx-low-code'
import type { CustomSlotsType } from '@/utils/type'
import { numberType, objectType, stringType } from '@/utils/type'
import useEditorStore from '@/store/modules/editor'
import './editWrapper.scss'

export default defineComponent({
  name: 'EditWrapper',
  props: {
    id: stringType(),
    index: numberType(),
    option: objectType<FormColumnProps>()
  },
  slots: Object as CustomSlotsType<{
    default?: () => any
  }>,
  setup(props, { emit, slots }) {
    const { currentElement } = storeToRefs(useEditorStore())

    const { option, index } = toRefs(props)

    const editWrapperRef = ref<HTMLDivElement>()

    const onSetActive = () => {
      emit('setActive', props.id)
    }

    const mouseEnter = () => {
      // emit('setHover', props.id)
      // console.log('mouseEnter', editWrapperRef.value?.getBoundingClientRect())
    }

    return () => {
      return (
        <div
          ref={editWrapperRef}
          draggable="true"
          class={['edit-wrapper w-100%', currentElement.value === props.id && 'active']}
          onClick={onSetActive}
          onMouseenter={mouseEnter}
        >
          <div class="pointer-events-none">{slots.default?.()}</div>

          {currentElement.value === props.id && (
            <div class="edit-wrapper__border">
              <div class="pos-absolute top--25px right-0">
                <ElButton size="small" type="primary" onClick={() => emit('copyItem')}>
                  复制
                </ElButton>
                <ElButton size="small" type="danger" onClick={() => emit('deleteItem')}>
                  删除
                </ElButton>
              </div>
            </div>
          )}
        </div>
      )
    }
  }
})
