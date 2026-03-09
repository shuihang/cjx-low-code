import { computed, defineComponent, onMounted, ref } from 'vue'
import { ElButton, ElCol, ElForm, ElIcon, ElRow } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useLocale } from '@cjx-low-code/hooks'
import { useCompRef } from '@cjx-low-code/hooks/useCompRef'
// import debounce from 'lodash-es/debounce';
import { ExpandOutlined } from '../../crud/src/icon'
// import type { ElementPlusSize } from '@/types/elementPlus'
import { useCrudInjectKey } from '../../crud/src/context'
import { getValueByPath } from './utils'
import { InitSearchFormVNode } from './init'
import { searchFromProps } from './interface'
import searchConfig from './searchConfig'
import type { CustomSlotsType } from '../../_util/type'
import type { FormColumnProps, FormOption, FromProps } from './interface'
import type { FormInstance } from 'element-plus'
import type { CSSProperties } from 'vue'

export type ElementPlusSize = 'default' | 'small' | 'large'

const {
  searchSpan: defaultSearchSpan,
  labelWidth: defaultLabelWidth,
  menuBtn: defaultMenuBtn,
  searchExpandStyle,
  slotSuffix,
  getColSpan
} = searchConfig

const itemHeight: { [key in ElementPlusSize]: number } = {
  default: 55,
  large: 67,
  small: 42
}
const lineHeight: { [key in ElementPlusSize]: string } = {
  default: '32px',
  large: '40px',
  small: '24px'
}

const XFormSearch = defineComponent({
  name: 'XFormSearch',
  props: searchFromProps(),
  slots: Object as CustomSlotsType<{
    formMenu?: any
    menu?: any
  }>,
  emits: ['reset', 'submit'],
  setup(props, { attrs, slots, emit }) {
    const { t } = useLocale()

    const { option } = props as FromProps
    const disabledForm = ref<boolean>(false)
    const formRef = ref<FormInstance>()

    const {
      formSpan = defaultSearchSpan,
      labelWidth = defaultLabelWidth,
      menuBtn = defaultMenuBtn
    } = option as FormOption

    // 双向绑定数据 回调函数
    const newForm = computed(() => props.form)
    const loading = ref<boolean>(false)

    const searchSpan = ref<number>(8)

    const { onExpandChange } = useCrudInjectKey().value

    const searchHeight = ref<string>()
    const searchItemHeight = ref<number>(itemHeight.default)
    // const sizeMap = computed(() => appStore.sizeMap)

    const boxRef = ref()
    const formRowRef = useCompRef(ElRow)
    const expandStyle = ref<CSSProperties>(searchExpandStyle)

    // 是否显示 展开状态
    const isExpand = ref<boolean>(true)
    // 是否显示展开
    const isShowExpand = ref<boolean>(false)
    const initExpand = () => {
      if (formRowRef.value?.$el) {
        searchSpan.value = getColSpan({
          width: isExpand.value ? boxRef.value?.offsetWidth - 180 : boxRef?.value.offsetWidth,
          searchSpan: formSpan,
          cloumnLength: option?.column?.length || 0
        })

        const showExpand = (isExpand.value ? rowLength : rowLength + 1) / (24 / searchSpan.value)
        isShowExpand.value = (!isExpand.value && showExpand === 1) || showExpand > 1

        const storeyNumber = (isExpand.value ? rowLength : rowLength + 1) / (24 / searchSpan.value)
        const handleStoreyNumber =
          storeyNumber !== 1 && searchSpan.value !== 4 ? Math.ceil(storeyNumber) : storeyNumber + 1

        searchHeight.value = `${handleStoreyNumber * searchItemHeight.value}px`
        // expandStyle.value.height = searchItemHeight.value + 'px';

        expandStyle.value = {
          height: !isExpand.value ? searchHeight.value : `${searchItemHeight.value}px`,
          overflow: 'hidden',
          transition: 'height 0.2s'
          // transitionTimingFunction: 'linear'
        }

        // expandStyle.value.height = !isExpand.value ? searchHeight.value : searchItemHeight.value + 'px'
        onExpandChange(
          !isExpand.value ? Number(searchHeight.value?.replace('px', '')) : searchItemHeight.value
        )

        // console.log(isExpand.value ? rowLength : rowLength + 1, searchSpan.value, storeyNumber, handleStoreyNumber)
        // console.log(storeyNumber.toString().indexOf('.'), Math.ceil(storeyNumber.toString().indexOf('.') != -1 ? storeyNumber : storeyNumber + 1))
      }
    }

    let rowLength = 0
    onMounted(() => {
      if (formRowRef?.value?.$el) {
        rowLength = formRowRef.value?.$el.children.length
      }
      // console.log('1111', mergedId, document.querySelector(`.x_crud_4`)?.offsetWidth)
      // cjx-crud组件在el-tab-pane 组件里，会导致宽度获取不到，所以这里监听宽度变化获取
      let boxWidth = 0
      const observer = new ResizeObserver((entries) => {
        // 遍历 entries 数组，获取目标元素和它的大小信息
        for (const entry of entries) {
          // 在控制台输出宽度信息
          if (boxWidth !== entry.contentRect.width) {
            // console.log('目标元素的宽度是：', entry.contentRect.width);
            initExpand()
          }
          boxWidth = entry.contentRect.width
        }
      })
      observer.observe(boxRef.value)
    })

    const onExpand = () => {
      isExpand.value = !isExpand.value
      initExpand()
    }

    const onUpdateModelValue = (prop: string, value: string) => {
      getValueByPath(newForm, prop).value = value
    }

    // 提交
    const onSubmit = () => {
      loading.value = true

      const formData = newForm.value
      const propsFormData = props.form.value

      ;(option?.column as FormColumnProps[])
        ?.filter((item) => slots[`${item.prop}Search` as keyof typeof slots])
        .forEach((item) => {
          formData[item.prop] = propsFormData[item.prop]
        })

      disabledForm.value = true
      emit('submit', newForm.value, () => {
        disabledForm.value = false
        loading.value = false
      })
    }

    const resetChang = () => {
      formRef.value?.resetFields()
      emit('reset')
    }

    return () => (
      <div class={'flex'} ref={boxRef}>
        <ElRow
          class={['!position-relative ', isExpand.value ? 'w-[calc(100%-180px)]' : 'w-100%']}
          {...attrs}
          style={expandStyle.value}
        >
          <ElCol
            lg={isExpand.value ? 20 : 24}
            md={isExpand.value ? 18 : 24}
            xs={isExpand.value ? 16 : 24}
          >
            {
              <ElForm
                ref={formRef}
                model={newForm.value}
                disabled={disabledForm.value}
                label-position={'left'}
              >
                <ElRow
                  gutter={20}
                  class={`cjx-Search-row position-relative w-100%`}
                  ref={formRowRef}
                >
                  {InitSearchFormVNode({
                    column: option?.column as FormColumnProps[],
                    formSpan: searchSpan.value,
                    labelWidth,
                    newForm,
                    slotSuffix,
                    slots,
                    onUpdateModelValue,
                    onSubmit
                  })}

                  {menuBtn && isShowExpand.value && (
                    <ElCol lg={2} md={2} xs={4}>
                      {
                        <div
                          class={`flex m-l-10px flex-items-center w-40px font-size-12px color-#999999 cursor-pointer whitespace-nowrap`}
                          style={{ lineHeight: lineHeight.default } as any}
                          onClick={onExpand}
                        >
                          {isExpand.value ? <>{t('common.expand')}</> : <>{t('common.shrink')}</>}
                          <ElIcon
                            style={{
                              transform: `rotateZ(${isExpand.value ? 0 : 180}deg)`
                            }}
                          >
                            <ExpandOutlined />
                          </ElIcon>
                        </div>
                      }
                    </ElCol>
                  )}

                  {/* 搜索栏操作区域 */}
                  {!isExpand.value && (
                    <ElCol lg={4} md={6} xs={6} class={['!flex m-l-10px']}>
                      {slots.menu?.()}

                      {props.queryBtn && (
                        <ElButton
                          type="primary"
                          onClick={onSubmit}
                          v-slots={{ icon: () => <Search /> }}
                          loading={loading.value}
                        >
                          {t('common.query')}
                        </ElButton>
                      )}

                      <ElButton
                        type={'primary'}
                        plain
                        onClick={resetChang}
                        v-slots={{ icon: () => <Refresh /> }}
                      >
                        {t('common.reset')}{' '}
                      </ElButton>
                    </ElCol>
                  )}
                </ElRow>
              </ElForm>
            }
          </ElCol>

          {menuBtn && isExpand.value && isShowExpand.value && (
            <ElCol lg={2} md={2} xs={4}>
              {
                <div
                  class={`flex m-l-10px flex-items-center w-40px
                   font-size-12px color-#999999 cursor-pointer`}
                  style={{ lineHeight: lineHeight.default } as any}
                  onClick={onExpand}
                >
                  {isExpand.value ? <>{t('common.expand')}</> : <>{t('common.shrink')}</>}
                  <ElIcon
                    style={{
                      transform: `rotateZ(${isExpand.value ? 0 : 180}deg)`
                    }}
                  >
                    <ExpandOutlined />
                  </ElIcon>
                </div>
              }
            </ElCol>
          )}
        </ElRow>

        {/* 搜索栏操作区域 */}
        {isExpand.value && (
          <div class={['!flex m-l-4px']}>
            {props.queryBtn && (
              <ElButton
                type="primary"
                onClick={onSubmit}
                v-slots={{ icon: () => <Search /> }}
                loading={loading.value}
              >
                {t('common.query')}
              </ElButton>
            )}

            <ElButton
              type={'primary'}
              plain
              onClick={resetChang}
              v-slots={{ icon: () => <Refresh /> }}
            >
              {t('common.reset')}{' '}
            </ElButton>

            {slots.menu?.()}
          </div>
        )}
      </div>
    )
  }
})

export default XFormSearch
