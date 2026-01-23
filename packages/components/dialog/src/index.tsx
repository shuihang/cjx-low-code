import { computed, defineComponent, ref, watchEffect } from 'vue'
import { ElButton, ElCol, ElDialog, ElDrawer, ElIcon, ElRow } from 'element-plus'
import { CircleCheck, CircleClose, CloseBold } from '@element-plus/icons-vue'
import { useLocale } from '@cjx-low-code/hooks'
import { useDialogProviderKey } from '../../dialog/src/context'
import { ExitRetractOutlined, RetractOutlined } from '../../crud/src/icon/index'
import type { CustomSlotsType } from '../../_util/type'
import type { CSSProperties, PropType } from 'vue'

export interface DialogProps {
  /** 弹窗标题 */
  title: string
  /** 弹窗是否显示 */
  visible: boolean
  /** 弹窗类型 默认为`Dialog` */
  type?: 'Dialog' | 'Drawer'
  /** 弹窗宽度 默认为`80%` */
  width?: number | string
  /** 是否显示弹窗操作区域 默认为`true`*/
  menu?: boolean
  /** 确定按钮是否点击后有加载动画 默认为`true` */
  loading?: boolean
  /** 是否显示关闭按钮 默认为`true` */
  showCloseBtn?: boolean
  /** 关闭按钮的文本 默认为`取消` */
  closeBtnText?: string | number
  /** 点击关闭按钮响应的事件 */
  onClose?: () => void
  /** 是否显示确定按钮 默认为`false` */
  showSaveBtn?: boolean
  /** 确定按钮的文本 默认为`确定`*/
  saveBtnText?: string | number
  /** 点击确定按钮响应的事件 */
  onSave?: (done: (close?: boolean) => void, data?: any) => void
  data?: any
  /** 点击全屏响应的事件 */
  onFullscreen?: (v: boolean) => void
}

const contentDefaultStyle: CSSProperties = {
  maxHeight: 'calc(-150px + 90vh)',
  overflowY: 'auto',
}

export default defineComponent({
  name: 'ZtDialog',
  props: {
    option: {
      type: Object as PropType<DialogProps>,
      default: () => ({
        title: '',
        visible: false,
        width: '80%',
        menu: true,
      }),
    },
    contentStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({
        marginLeft: '-20px',
        marginRight: '-16px',
        maxHeight: 'calc(-150px + 90vh)',
        overflowY: 'auto',
        // overflowX: 'hidden',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '0px 20px',
      }),
    },
  },
  slots: Object as CustomSlotsType<{
    /* 操作区域插槽 */
    default?: any
    menu?: any
  }>,
  emits: ['submit', 'update:option', 'close', 'fullscreenChange'],
  setup: (props, { attrs, slots, emit }) => {
    const { t } = useLocale()

    const isFullscreen = ref<boolean>(false)
    useDialogProviderKey(
      computed(() => ({
        isFullscreen,
      }))
    )

    const visible = ref<boolean>(props.option.visible)
    const btnLoading = ref<boolean>(false)
    const {
      width,
      menu = true,
      showCloseBtn = true,
      closeBtnText,
      saveBtnText,
      loading = true,
    } = props.option

    const isDrawer = computed(() => props.option.type === 'Drawer')
    const Component = computed(() => isDrawer.value ? ElDrawer : ElDialog)

    const data = ref<any>()

    const close = () => {
      emit('close')
      emit('update:option', {
        ...props.option,
        visible: false,
      })
      //props.option.visible
      props.option?.onClose && props.option.onClose()
    }

    watchEffect(() => {
      visible.value = props.option.visible
      data.value = props.option?.data
      setTimeout(() => {
        isFullscreen.value = false
      }, 200)
    })

    return () => (
      <Component.value
       class={['cjx-dialog', isDrawer.value && 'cjx-dialog-drawer', isDrawer.value || isFullscreen.value ? 'max-h-100vh' : 'max-h-90vh', ]}
        {...attrs}
        show-close={false}
        modelValue={visible.value}
        fullscreen={isFullscreen.value}
        width={width || '80%'}
        size={isFullscreen.value ? '100%' : width || '80%'}
        align-center
        onClose={close}
        style={{
          overflow: 'hidden',
        } as CSSProperties}
        draggable
        append-to-body
        close-on-click-modal={false}
        modal={!isDrawer.value}
        resizable
        v-slots={{
          header: () => (
            <ElRow>
              <ElCol
                span={16}
                class={
                  'font-500 color-[var(--cjx-dialog-title-color)] font-size-16px'
                }
              >
                {props.option.title}
              </ElCol>
              <ElCol span={8} class={'!flex justify-end'}>
                <ElIcon
                  size={16}
                  color="var(--cjx-dialog-icon-color)"
                  class={'mr-12px cursor-pointer'}
                  onClick={() => {
                    isFullscreen.value = !isFullscreen.value
                    emit('fullscreenChange', isFullscreen.value)
                    props.option?.onFullscreen &&
                      props.option.onFullscreen(isFullscreen.value)
                  }}
                >
                  {isFullscreen.value ? (
                    <ExitRetractOutlined />
                  ) : (
                    <RetractOutlined />
                  )}
                </ElIcon>

                <ElIcon
                  color="var(--cjx-dialog-icon-color)"
                  size={16}
                  class={'cursor-pointer'}
                  onClick={() => {
                    emit('update:option', {
                      ...props.option,
                      visible: false,
                    })
                    btnLoading.value = false
                    visible.value = false
                    emit('close')
                  }}
                >
                  <CloseBold />
                </ElIcon>
              </ElCol>
            </ElRow>
          ),
        }}
      >
        <div
          style={{
            ...props.contentStyle,
            maxHeight: (menu || menu == undefined) && !isDrawer.value ? isFullscreen.value ? 'calc(100vh - 150px)' : 'calc(90vh - 150px)' : ''
        }}
          class={['zt-dialog-content flex flex-col', isFullscreen.value && !isDrawer.value && '!h-100%', isDrawer.value && menu ? 'h-[calc(100%-50px)]' : 'h-100%']}
        >
          {slots.default?.()}
        </div>

        {menu && (
          <div
            class={`w-[calc(100%+40px)] m-l--20px p-r-20px p-t-15px m-t-4px
            box-border b-t-solid b-t-1px b-t-cjx-dialog-border-color flex justify-end`}
          >
            {showCloseBtn && (
              <ElButton
                v-slots={{ icon: () => <CircleClose /> }}
                onClick={() => {
                  emit('update:option', {
                    ...props.option,
                    visible: false,
                  })
                  btnLoading.value = false
                  visible.value = false
                  emit('close')
                  props.option?.onClose && props.option.onClose()
                }}
              >
                {closeBtnText || t('common.cancel')}
              </ElButton>
            )}

            {slots.menu?.()}

            {props.option?.showSaveBtn && (
              <ElButton
                v-slots={{ icon: () => <CircleCheck /> }}
                type="primary"
                loading={loading && btnLoading.value}
                onClick={() => {
                  btnLoading.value = true
                  props.option?.onSave &&
                    props.option.onSave((close = true) => {
                      btnLoading.value = false
                      if (close) {
                        visible.value = false
                        emit('update:option', {
                          ...props.option,
                          visible: false,
                        })
                      }
                    }, data.value)
                }}
              >
                {saveBtnText || t('common.ok')}
              </ElButton>
            )}
          </div>
        )}
      </Component.value>
    )
  },
})
