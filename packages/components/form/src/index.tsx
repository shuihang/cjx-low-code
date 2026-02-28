import { computed, defineComponent, ref } from 'vue'
import { ElCol, ElForm, ElRow, ElTabs } from 'element-plus'
import type { CSSProperties } from 'vue'
import type {
  FormInstance,
  FormItemProp,
  FormValidateCallback,
} from 'element-plus'
import { withInstall } from '../../_util/type'
import { useDialogInjectKey } from '../../dialog/src/context'
import { fromProps } from './interface'
import { useFormProviderKey } from './context'
import form_config from './config'
import XFormColumn from './type/column-form';
import XGroupForm from './type/group-form'
import XFromMenu from './menu'
import { getValueByPath } from './utils'
import type { CustomSlotsType } from '../../_util/type'
import type {
  Arrayable,
  DialogFormType,
  FormColumnProps,
  FormOption,
  FormSlot,
  FromProps,
} from './interface'

const { span, label_width, menu_btn } = form_config

const formEmits = {
  reset: (done: () => void) => true,
  submit: (form: object, done: (isClear?: boolean) => void) => true,
  formTabChange: (index: number | string) => true,
}

export const XForm = withInstall(defineComponent({
  // 组件名称
  name: 'XForm',
  inheritAttrs: false,
  // 组件属性，从fromProps函数获取
  props: fromProps(),
  // 组件插槽，定义了默认插槽和表单操作栏插槽
  slots: Object as CustomSlotsType<
    {
      /** 表单插槽 */
      default?: void
      /** 表单操作栏插槽 */
      formMenu?: void
      /** 表单头部位置插槽 */
      formHeader?: (props: { _XBoxType?: DialogFormType }) => any
      /** 表单底部位置插槽 */
      formFooter?: (props: { _XBoxType?: DialogFormType }) => any
    } & FormSlot
  >,
  emits: formEmits,
  setup(props, { slots, emit, expose }) {
    const { form = {}, option, xBoxType, _slotSuffix: slotSuffix = '' } = props as FromProps

    const disabledForm = ref<boolean>(props.disabled || false)
   const {
      formSpan = props.isView ? undefined : span,
      labelWidth = label_width,
      checkColumnSpan = 2
    } = option as FormOption;

    // 双向绑定数据 回调函数
    const newForm = computed(() => props.form);

    const { isFullscreen = ref<boolean>(false) } =
      useDialogInjectKey().value || {}

    useFormProviderKey(
      computed(() => ({
        newForm,
        formSpan,
        labelWidth,
        xBoxType,
        isView: computed(() => props.isView),
        isFullscreen,
        slotSuffix,
        onUpdateModelValue,
      }))
    )

    const ruleFormRef = ref<FormInstance>()

    const tabsValue = ref<number | string>(
      props.option?.viewTabsCurrent
        ? props.option.viewTabsCurrent
        : props.option?.viewTabs && props.option.viewTabs?.length > 0
        ? props.option.viewTabs[0].value
        : '0'
    )

    const onUpdateModelValue = (prop: string, value: string) => {
      // form && newForm.value && (newForm.value[prop] = value)
      form && newForm.value && (getValueByPath(newForm, prop).value = value)
    }

    const formTabChange = (v: number | string) => {
      tabsValue.value = v
      emit('formTabChange', v)
    }

    // 重置表单
    const onReset = () => {
      ruleFormRef.value?.resetFields()
      emit('reset', () => {
        disabledForm.value = false
      })
    }

    // 提交表单
    const onSubmit = () => {
      // form插槽 响应
      if (slots.default) {
        emit('submit', newForm.value, () => {
          disabledForm.value = false
        })
        return
      }

      ruleFormRef.value?.validate((valid, fields) => {
        console.log('submit', newForm.value)
        if (valid) {
          disabledForm.value = true

          const unhandledrejectionHandler = () => {
            disabledForm.value = false
            window.removeEventListener('unhandledrejection', unhandledrejectionHandler)
          }

          window.addEventListener('unhandledrejection', unhandledrejectionHandler)

          emit('submit', newForm.value, (isClear = true) => {
            isClear && ruleFormRef.value?.resetFields()
            disabledForm.value = false
            window.removeEventListener('unhandledrejection', unhandledrejectionHandler)
          })
        } else {
          fields && ruleFormRef.value?.scrollToField(Object.keys(fields)[0])
          console.error('error submit!', fields)
        }
      })
    }

    const groupFormRef = ref<any>()

    const exposeFn = {
      ...ruleFormRef.value,
      scrollToField: (prop: FormItemProp) =>
        ruleFormRef.value?.scrollToField(prop),
      /** 移除该表单项的校验结果 */
      clearValidate: (props?: Arrayable<FormItemProp>) =>
        ruleFormRef.value?.clearValidate(props),
      /** 验证具体的某个字段*/
      validateField: (props?: Arrayable<FormItemProp>) =>
        ruleFormRef.value?.validateField(props),
      /** 重置表单 */
      resetFields: () => ruleFormRef.value?.resetFields(),
      /** 提交表单 */
      validate: (callback?: FormValidateCallback | undefined) =>
        ruleFormRef.value?.validate(callback),
      /** 提交表单2.0 */
      validateV2: (disableForm: boolean | undefined = true) => {
        return new Promise((resolve, reject) => {
          ruleFormRef.value?.validate((valid, fields) => {
            if (valid) {
              disableForm && (disabledForm.value = true)
              resolve([
                newForm.value,
                (isClear = true) => {
                  isClear && ruleFormRef.value?.resetFields()
                  disabledForm.value = false
                },
              ])
            } else {
              fields && ruleFormRef.value?.scrollToField(Object.keys(fields)[0])
              reject(fields)
            }
          })
        }) as Promise<[form: any, done: (isClear?: boolean) => void]>
      },
      /**
       * 展开或收起所有表单项 isView=true时有用
       * @param v true/全部展开 false/全部折叠
       * */
      collapseAllChange: (v: boolean) =>
        groupFormRef.value.collapseAllChange(v),
      /** 手动设置表单不可编辑 */
      setFormDisabled: () => (disabledForm.value = true),
      /** 手动设置表单可编辑 */
      setFormAvailable: () => (disabledForm.value = false),
    }

    expose(exposeFn)

    return {
      ...exposeFn,
      xBoxType,
      isFullscreen,
      newForm,
      ruleFormRef,
      groupFormRef,
      disabledForm,
      onReset,
      onSubmit,
      formTabChange,
      tabsValue,
    }
  },
  render() {
    const {
      menuBtn = menu_btn,
      submitBtn = true,
      cancelBtn = true,
      submitBtnText,
      cancelBtnText,
      viewTabs,
      viewTabsCurrent,
    } = this.$props.option
    const { class: $class } = this.$attrs
    const Component = viewTabs ? ElTabs : ''

    // 更新 tabsValue 如果 viewTabsCurrent 变化
    if (viewTabsCurrent !== undefined && this.tabsValue !== viewTabsCurrent) {
      this.tabsValue = viewTabsCurrent
    } else if (
      !viewTabsCurrent &&
      viewTabs &&
      viewTabs.length > 0 &&
      this.tabsValue !== viewTabs[0].value
    ) {
      this.tabsValue = viewTabs[0].value
    }

    return (
      <ElRow class={['!position-initial cjx-form h-100%', $class]}>
        <ElCol lg={24} md={24} xs={24} class='h-[calc(100%-50px)]'>
          {
            viewTabs &&
            viewTabs.length > 0 &&
            (this.$props.isView ||
              this.xBoxType === 'check' ||
              this.xBoxType == undefined) ? (
              <Component
                type="card"
                class={'w-100% cjx-tab-form'}
                style={
                  {
                    ...this.$props.contentStyle,
                    overflow: 'hidden',
                  } as CSSProperties
                }
                onTabChange={this.formTabChange}
                v-model:modelValue={this.tabsValue}
              >
                {viewTabs.map((item, index) => {
                  return (
                    <>
                      {(this.$slots[`${item.value}TabForm`] || index === 0) && (
                        <el-tab-pane
                          key={index}
                          name={item.value || index}
                          label={item.label}
                          class={[
                            'w-100% of-y-auto of-x-hidden',
                            this.isFullscreen
                              ? 'h-[calc(100vh-136px-var(--el-tabs-header-height))]'
                              : 'max-h-[calc(90vh-166px-var(--el-tabs-header-height))]',
                          ]}
                        >
                          {this.$slots[`${item.value}TabForm`]
                            ? this.$slots[`${item.value}TabForm`]!()
                            : index === 0 && (
                                <ElForm
                                  ref="ruleFormRef"
                                  model={this.newForm}
                                  disabled={this.disabledForm}
                                  class={[
                                    this.isFullscreen &&
                                      'h-[calc(100vh-180px)]',
                                  ]}
                                >
                                <XFormColumn
                                  column={this.$props.option?.column as FormColumnProps[]}
                                  v-slots={this.$slots}
                                ></XFormColumn>

                                  {/*分组*/}
                                  <XGroupForm
                                    ref="groupFormRef"
                                    group={this.$props.option?.group}
                                    v-slots={this.$slots}
                                  />
                                </ElForm>
                              )}
                        </el-tab-pane>
                      )}
                    </>
                  )
                })}
              </Component>
            ) : (
              <ElForm
                ref="ruleFormRef"
                model={this.newForm}
                disabled={this.disabledForm}
                class={[this.isFullscreen && 'h-[calc(100vh-140px)]']}
              >
                <ElRow
                  gutter={12}
                  ref="rowRef"
                  style={this.$props.contentStyle}
                  class={`cjx-Form-row w-100%`}
                >
                  {(this.$slots.default && !this.$props.isView && (
                    <div
                      class={[
                        'w-100%',
                        this.isFullscreen && 'h-[calc(100vh-140px)]',
                      ]}
                      style={this.$props.contentStyle}
                    >
                      {this.$slots.default()}
                    </div>
                  )) || (
                    <>
                      <div class="cjx-form-header w-100%">
                        {this.$slots?.formHeader &&
                          this.$slots.formHeader({
                            _XBoxType: this.xBoxType,
                          })}
                      </div>

                      <XFormColumn
                        column={this.$props.option?.column as FormColumnProps[]}
                        v-slots={this.$slots}
                      ></XFormColumn>

                      {/*分组*/}
                      <XGroupForm
                        ref="groupFormRef"
                        group={this.$props.option?.group}
                        xBoxType={this.xBoxType}
                        v-slots={this.$slots}
                      />

                      <div class="cjx-form-footer w-100%">
                        {this.$slots?.formFooter &&
                          this.$slots?.formFooter({
                            _XBoxType: this.xBoxType,
                          })}
                      </div>
                    </>
                  )}
                </ElRow>
              </ElForm>
            )
          }
        </ElCol>

        {/* 搜索栏操作区域 */}
        {menuBtn && (
          <XFromMenu
            onReset={this.onReset}
            onSubmit={this.onSubmit}
            v-slots={{ menu: this.$slots.formMenu }}
            menuStyle={this.$props.menuStyle}
            loading={this.disabledForm}
            disabled={this.$props.disabled}
            cancelBtn={cancelBtn}
            submitBtn={submitBtn}
            cancelBtnText={cancelBtnText}
            submitBtnText={submitBtnText}
          ></XFromMenu>
        )}
      </ElRow>
    )
  },
}))

export default XForm
