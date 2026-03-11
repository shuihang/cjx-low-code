import { computed, defineComponent, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useLocale } from '@cjx-low-code/hooks'
import XForm from '../../../form'
import { formColumnValues, schemaLayoutValues } from '../../../form/src/interface'
import pick from '../../../_util/pick'
import omit from '../../../_util/omit'
import { useDialogProviderKey } from '../../../dialog/src/context'
import XDialog from '../../../dialog/src/index'
import crudConfig from '../config'
import { useCrudInjectKey } from '../context'
import type { DialogProps } from '../../../dialog/src/index'
import type { ComputedRef } from 'vue'
import type { CustomSlotsType } from '../../../_util/type'
import type {
  FromProps,
  SchemaItemArray,
  SchemaLayout,
  SchemaLayoutType
} from '../../../form/src/interface'
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
    const formProps = computed<FromProps>(() => {
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

      const newColumn = option.value.column?.map((item) => {
        return {
          ...pick(item, formColumnValues),
          placeholder: item.searchPlaceholder,
          clearable: item.searchClearable,
          order: item.formOrder ?? item.order,
          display: item[`${boxType.value}Display`] ?? item.display,
          disabled: item[`${boxType.value}Disabled`] ?? item.disabled
        }
      }) as SchemaItemArray

      const schemaField = cloneDeep(option.value.formSchemaField)?.map((item) => {
        if (schemaLayoutValues.includes(item.type as SchemaLayoutType)) {
          const layoutItem = item as SchemaLayout
          layoutItem.column = layoutItem?.column?.map((x) => {
            return {
              ...x,
              display: x[`${boxType.value}Display`] ?? x.display,
              disabled: x[`${boxType.value}Disabled`] ?? x.disabled
            }
          })
        }
        return item
      })

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
        schemaField: newColumn.concat(schemaField || []),
        xBoxType: boxType
      }
    })

    return () => (
      <XDialog option={dialogProps.value}>
        <XForm
          class={$class}
          {...formProps.value}
          form={props.form}
          ref={formRef}
          v-slots={{
            ...omit(slots, ['form'])
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
  }
})

export default XDiaLogForm
