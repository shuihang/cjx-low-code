import { defineComponent } from 'vue'
import { ElButton, ElCol } from 'element-plus'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'
// import { ExpandOutlined } from "../../crud/src/icon";
import { useLocale } from '@cjx-low-code/hooks'
import type { CustomSlotsType } from '../../_util/type'
import type { CSSProperties, PropType } from 'vue'

const XFromMenu = defineComponent({
  name: 'XFromMenu',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    menuStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => {},
    },
    submitBtn: {
      type: Boolean,
      default: true,
    },
    cancelBtn: {
      type: Boolean,
      default: true,
    },
    resetBtn: {
      type: Boolean,
      default: true,
    },
    submitBtnText: {
      type: String,
      default: '',
    },
    cancelBtnText: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
    resetText: {
      type: String,
    },
  },
  slots: Object as CustomSlotsType<{
    /* 表单操作区域插槽 */
    menu?: any
  }>,
  emits: ['reset', 'submit'],
  setup(props, { emit, slots }) {
    const { t } = useLocale()

    return () => {
      return (
        <>
          <ElCol
            span={24}
            class={`cjx-form-menu !flex justify-end flex-items-center p-10px p-r-0px`}
            style={props.menuStyle}
          >
            {props.cancelBtn && (
              <ElButton
                onClick={() => emit('reset')}
                v-slots={{ icon: () => <CircleClose /> }}
              >
                {props.cancelBtnText || t('common.cancel')}
              </ElButton>
            )}

            {slots.menu && slots.menu()}

            {!props.disabled && props.submitBtn && (
              <ElButton
                type="primary"
                loading={props.loading}
                onClick={() => emit('submit')}
                v-slots={{ icon: () => <CircleCheck /> }}
              >
                {props.submitBtnText || t('common.ok')}
              </ElButton>
            )}
          </ElCol>
        </>
      )
    }
  },
})

export default XFromMenu
