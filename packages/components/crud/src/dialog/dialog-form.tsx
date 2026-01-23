import { computed, defineComponent, ref, watchEffect } from 'vue'
import type { ComputedRef } from 'vue'
import { ElDialog, ElDrawer} from 'element-plus'
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
  FormColumnProps,
  FromProps,
} from '../../../form/src/interface'
import type { DialogFormType, TableGroupInterface } from '../interface'

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
    
    const {
      option,
      boxType,
      formRef,
      reload,
      onFormSubmitChange,
      onCloseChange,
      onDialogTabChange,
    } = useCrudInjectKey().value

    const { isDrawer, dialogWidth = dialog_width } = option.value

    const newSubmitBtn = ref<boolean>(false)

    const isFullscreen = ref<boolean>(false)
    useDialogProviderKey(
      computed(() => ({
        isFullscreen,
      }))
    )

    // const disabled = computed(() => boxType.value === 'check');
    let newColumn: FormColumnProps[] | undefined,
      formProps: FromProps,
      newGroup: TableGroupInterface[] | undefined

    const title = ref<string>('')

    // 是否查看
    const isView = ref<boolean>(false)

    const dialogProps: ComputedRef<DialogProps> = computed(() => ({
      title: title.value,
      visible: props.showDialogForm,
      width: dialogWidth,
      menu: false,
    }))

    // watch(() => boxType.value, () => {
    //   isFullscreen.value = false
    // })

    watchEffect(() => {
      const {
        viewTitle,
        addTitle,
        editTitle,
        labelWidth,
        checkLabelWidth,
        span,
        menuBtn = true,
        checkColumnSpan,
        cancelBtn,
        cancelBtnText,
        submitBtn,
        submitBtnText,
      } = option.value

      const formTitle: TitleType = {
        check: viewTitle || t('action.check'),
        update: editTitle || t('action.edit'),
        create: addTitle || t('action.add'),
      }
      // console.log('formTitle', useCrudInjectKey())
      title.value = formTitle[boxType.value]

      newSubmitBtn.value =
        submitBtn !== undefined ? submitBtn : boxType.value !== 'check'
      isView.value = boxType.value === 'check'

      newColumn = option.value.column?.map((item) => {
        return {
          ...pick(item, formColumnValues),
          slot: item.formSlot,
          placeholder: item.searchPlaceholder,
          clearable: item.searchClearable,
          order: item.formOrder ?? item.order,
          display: item[`${boxType.value}Display`] ?? item.display,
          disabled: item[`${boxType.value}Disabled`] ?? item.disabled,
        }
      })

      newGroup = cloneDeep(option.value.group)?.map((item) => {
        item.column = item?.column?.map((x) => {
          return {
            ...x,
            display: x[`${boxType.value}Display`] ?? x.display,
            disabled: x[`${boxType.value}Disabled`] ?? x.disabled,
          }
        })
        return item
      })

      formProps = {
        option: {
          column: newColumn,
          group: newGroup,
          labelWidth:
            boxType.value !== 'check'
              ? labelWidth
              : checkLabelWidth || labelWidth,
          formSpan: span || 12,
          viewTabsCurrent: option.value.viewTabsCurrent,
          viewTabs: option.value.viewTabs,
          menuBtn,
          cancelBtn,
          cancelBtnText,
          submitBtn: newSubmitBtn.value,
          submitBtnText,
          checkColumnSpan,
        },
        xBoxType: boxType,
      }
    })

    // 是否为抽屉
    const Component = isDrawer ? ElDrawer : ElDialog

    const { class: $class } = attrs

    return () => (
      <XDialog option={dialogProps.value}>
        <XForm
          class={$class}
          key={reload.value}
          {...formProps}
          // option={{...formProps.option, column: newColumn}}
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
