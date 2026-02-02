import { computed, defineComponent, ref } from 'vue'
import type { ComputedRef } from 'vue'
import XDialog from '../../../dialog/src/index';
import type { DialogProps } from '../../../dialog/src/index';
import XForm from '../../../form'
import { formColumnValues } from '../../../form/src/interface'
import pick from '../../../_util/pick'
import omit from '../../../_util/omit'
import { cloneDeep } from 'lodash-unified'
import { useDialogProviderKey } from '../../../dialog/src/context'
import { useLocale } from '@cjx-low-code/hooks'
import crudConfig from '../config'
import { useCrudInjectKey } from '../context'
import type { CustomSlotsType } from '../../../_util/type'
import type {
  FromProps,
} from '../../../form/src/interface'
import type { DialogFormType } from '../interface'

const { dialog_width } = crudConfig

type TitleType = {
  [K in DialogFormType]: string
}

const XDiaLogForm = defineComponent({
  name: 'XDiaLogForm',
  props: {
    showDialogForm: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => {},
    },
  },
  slots: Object as CustomSlotsType<{
    /* 表单插槽 */
    form?: any
  }>,
  setup(props, { slots, attrs }) {
    const { t } = useLocale() // 国际化
    const { class: $class } = attrs
    
    const {
      option,
      boxType,
      formRef,
      onFormSubmitChange,
      onCloseChange,
      onDialogTabChange,
    } = useCrudInjectKey().value

    const isFullscreen = ref<boolean>(false)
    useDialogProviderKey(
      computed(() => ({
        isFullscreen,
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
        dialogWidth = dialog_width,
        isDrawer = false,
      } = option.value
      
      const formTitle: TitleType = {
        check: viewTitle || t('action.check'),
        update: editTitle || t('action.edit'),
        create: addTitle || t('action.add'),
      };
      
      return {
        type: isDrawer ? 'Drawer' : 'Dialog',
        title: formTitle[boxType.value],
        visible: props.showDialogForm,
        width: dialogWidth,
        menu: false,
        onClose: onCloseChange,
      };
    })
    
    // 表单属性
    const formProps = computed<FromProps>(() => {
      const {
        labelWidth,
        checkLabelWidth,
        span,
        menuBtn = true,
        checkColumnSpan,
        cancelBtn,
        cancelBtnText,
        submitBtn,
      } = option.value
      
      const newSubmitBtn = submitBtn !== undefined ? submitBtn : boxType.value !== 'check'
      
      const newColumn = option.value.column?.map((item) => {
        return  {
          ...pick(item, formColumnValues),
          placeholder: item.searchPlaceholder,
          clearable: item.searchClearable,
          order: item.formOrder ?? item.order,
          display: item[boxType.value + 'Display'] ?? item.display,
          disabled: item[boxType.value + 'Disabled'] ?? item.disabled,
        };
      })
      
      const newGroup = cloneDeep(option.value.group)?.map(item => {
        item.column = item?.column?.map(x => {
          return {
            ...x,
            display: x[boxType.value + 'Display'] ?? x.display,
            disabled: x[boxType.value + 'Disabled'] ?? x.disabled,
          }
        })
        return item
      })
      
      return {
        option: {
          column: newColumn,
          group: newGroup,
          labelWidth: boxType.value !== 'check'? labelWidth : checkLabelWidth || labelWidth,
          formSpan: span,
          viewTabsCurrent: option.value.viewTabsCurrent,
          viewTabs: option.value.viewTabs,
          menuBtn,
          cancelBtn,
          cancelBtnText,
          submitBtn: newSubmitBtn,
          submitBtnText: option.value.submitBtnText,
          checkColumnSpan
        },
        ztBoxType: boxType,
      };
    })

    return () => (
      <XDialog option={dialogProps.value}>
        <XForm
          class={$class}
          {...formProps.value}
          form={props.form}
          ref={formRef}
          v-slots={{
            ...omit(slots, ['form']),
            default: slots.form,
          }}
          _slotSuffix="Form"
          isView={isView.value}
          onReset={() => {
            isFullscreen.value = false
            onCloseChange()
          }}
          onSubmit={onFormSubmitChange}
          onFormTabChange={onDialogTabChange}
        ></XForm>
      </XDialog>
    )
  },
})

export default XDiaLogForm
