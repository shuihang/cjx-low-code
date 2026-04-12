import { computed, defineComponent, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { omit, pick } from '@cjx-low-code/shared'
import { useLocale } from '../../../../hooks'
import XForm from '../../../form'
import { useDialogProviderKey } from '../../../dialog/src/context'
import XDialog from '../../../dialog/src/index'
import crudConfig from '../config'
import { useCrudInjectKey } from '../context'
import type { DialogProps } from '../../../dialog/src/index'
import type { ComputedRef } from 'vue'
import type { CustomSlotsType } from '@cjx-low-code/shared'

import type { DialogFormType } from '../interface'

const { dialogWidth: defaultDialogWidth } = crudConfig

type TitleType = {
  [K in DialogFormType]: string
}

const XDiaLogForm = defineComponent({
  name: 'XDiaLogForm',
  props: {
    showDialogForm: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  slots: Object as CustomSlotsType<{
    /* 表单插槽 */
    form?: () => void
  }>,
  setup(props, { slots, attrs }) {
    const { t } = useLocale() // 国际化
    const { class: $class } = attrs

    const { option, boxType, formRef, onFormSubmitChange, onCloseChange, onDialogTabChange } =
      useCrudInjectKey().value

    const isFullscreen = ref<boolean>(false)
    useDialogProviderKey(
      computed(() => ({
        isFullscreen
      }))
    )

    // 是否查看
    const isView = computed(() => boxType.value === 'check')

    // 对话框属性
    const dialogProps: ComputedRef<DialogProps> = computed(() => {
      const {
        viewTitle,
        addTitle,
        editTitle,
        dialogWidth = defaultDialogWidth,
        isDrawer = false
      } = option.value

      const formTitle: TitleType = {
        check: viewTitle || t('action.check'),
        update: editTitle || t('action.edit'),
        create: addTitle || t('action.add')
      }

      return {
        type: isDrawer ? 'Drawer' : 'Dialog',
        title: formTitle[boxType.value],
        visible: props.showDialogForm,
        width: dialogWidth,
        menu: false,
        onClose: onCloseChange
      }
    })

    // 表单属性
    const formProps = computed(() => {
      const {
        labelWidth,
        checkLabelWidth,
        span,
        menuBtn = true,
        checkColumnSpan,
        cancelBtn,
        cancelBtnText,
        submitBtn
      } = option.value

      const newSubmitBtn = submitBtn !== undefined ? submitBtn : boxType.value !== 'check'

      return {
        option: {
          labelWidth: boxType.value !== 'check' ? labelWidth : checkLabelWidth || labelWidth,
          formSpan: span,
          menuBtn,
          cancelBtn,
          cancelBtnText,
          submitBtn: newSubmitBtn,
          submitBtnText: option.value.submitBtnText,
          checkColumnSpan
        },

        xBoxType: boxType
      }
    })

    return () => <XDialog option={dialogProps.value}></XDialog>
  }
})

export default XDiaLogForm
