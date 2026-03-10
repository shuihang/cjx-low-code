import { computed, defineComponent, ref } from 'vue'
import { ElCol, ElForm, ElRow } from 'element-plus'
import { withInstall } from '../../_util/type'
import { useDialogInjectKey } from '../../dialog/src/context'
import { fromProps } from './interface'
import { useFormProviderKey } from './context'
import formConfig from './config'
import XFormColumn from './type/column-form'
import XGroupForm from './type/group-form'
import XFromMenu from './menu'
import { getValueByPath } from './utils'
import type { FormInstance, FormItemProp, FormValidateCallback } from 'element-plus'
import type { CustomSlotsType } from '../../_util/type'
import type { Arrayable, DialogFormType, FormColumnProps, FormSlot, FromProps } from './interface'

const { span, labelWidth: defaultLabelWidth, menuBtn: defaultMenuBtn } = formConfig

/* eslint-disable @typescript-eslint/no-unused-vars */
const formEmits = {
  reset: (done: () => void) => true,
  submit: (form: object, done: (isClear?: boolean) => void) => true,
  formTabChange: (index: number | string) => true
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const XForm = withInstall(
  defineComponent({
    // 组件名称
    name: 'XForm',
    inheritAttrs: false,
    // 组件属性，从fromProps函数获取
    props: fromProps(),
    // 组件插槽，定义了默认插槽和表单操作栏插槽
    slots: Object as CustomSlotsType<
      {
        default: void
        /** 表单操作栏插槽 */
        formMenu?: void
        /** 表单头部位置插槽 */
        formHeader?: (props: { _XBoxType?: DialogFormType }) => any
        /** 表单底部位置插槽 */
        formFooter?: (props: { _XBoxType?: DialogFormType }) => any
      } & FormSlot
    >,
    emits: formEmits,
    setup(props, { emit, expose }) {
      const { form = {}, option, xBoxType, _slotSuffix: slotSuffix = '' } = props as FromProps

      const disabledForm = ref<boolean>(props.disabled || false)

      const { formSpan = props.isView ? undefined : span, labelWidth = defaultLabelWidth } =
        option || {}
      // 双向绑定数据 回调函数
      const newForm = computed(() => props.form)

      const { isFullscreen = ref<boolean>(false) } = useDialogInjectKey().value || {}

      useFormProviderKey(
        computed(() => ({
          newForm,
          formSpan,
          labelWidth,
          xBoxType,
          isView: computed(() => props.isView),
          isFullscreen,
          slotSuffix,
          onUpdateModelValue
        }))
      )

      const ruleFormRef = ref<FormInstance>()

      const onUpdateModelValue = (prop: string, value: string) => {
        form && newForm.value && (getValueByPath(newForm, prop).value = value)
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
        ruleFormRef.value?.validate((valid, fields) => {
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
        scrollToField: (prop: FormItemProp) => ruleFormRef.value?.scrollToField(prop),
        /** 移除该表单项的校验结果 */
        clearValidate: (props?: Arrayable<FormItemProp>) => ruleFormRef.value?.clearValidate(props),
        /** 验证具体的某个字段*/
        validateField: (props?: Arrayable<FormItemProp>) => ruleFormRef.value?.validateField(props),
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
                  }
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
        collapseAllChange: (v: boolean) => groupFormRef.value.collapseAllChange(v),
        /** 手动设置表单不可编辑 */
        setFormDisabled: () => (disabledForm.value = true),
        /** 手动设置表单可编辑 */
        setFormAvailable: () => (disabledForm.value = false)
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
        onSubmit
      }
    },
    render() {
      const {
        menuBtn = defaultMenuBtn,
        submitBtn = true,
        cancelBtn = true,
        submitBtnText,
        cancelBtnText
      } = this.$props.option || {}
      const { class: $class } = this.$attrs

      return (
        <>
          {this.$slots.default?.()}
          <ElRow class={['!position-initial cjx-form h-100%', $class]}>
            <ElCol lg={24} md={24} xs={24} class="h-[calc(100%-50px)]">
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
                  {
                    <>
                      <div class="cjx-form-header w-100%">
                        {this.$slots?.formHeader &&
                          this.$slots.formHeader({
                            _XBoxType: this.xBoxType
                          })}
                      </div>

                      <XFormColumn
                        column={this.$props.schemaField?.column as FormColumnProps[]}
                        v-slots={this.$slots}
                      ></XFormColumn>

                      {/*分组*/}
                      <XGroupForm
                        ref="groupFormRef"
                        group={this.$props.schemaField?.group}
                        xBoxType={this.xBoxType}
                        v-slots={this.$slots}
                      />

                      <div class="cjx-form-footer w-100%">
                        {this.$slots?.formFooter &&
                          this.$slots?.formFooter({
                            _XBoxType: this.xBoxType
                          })}
                      </div>
                    </>
                  }
                </ElRow>
              </ElForm>
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
        </>
      )
    }
  })
)

export default XForm
