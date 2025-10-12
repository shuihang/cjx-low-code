import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import {
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElIcon,
  ElPopover,
  ElTooltip,
} from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import Sortable from 'sortablejs'
import { someType } from '@cjx-low-code/components/_util/type'
import { arraySort } from '@cjx-low-code/components/_util/tool'
import { useLocale } from '@cjx-low-code/hooks'
import {
  DensityFilled,
  DragOutlined,
  ExcelOutlined,
  FixedOutlined,
  HideSearchBarOutlined,
  ImportOutlined,
  RefreshOutlined,
  SettingOutlined,
  ShowSearchBarOutlined,
} from '../icon/index'
import { useCrudInjectKey } from '../context'
import crudConfig from '../config'
import type { CustomSlotsType } from '@cjx-low-code/components/_util/type'
import type { ColumnProps, CrudPageProps } from '../interface'
import type { CSSProperties, PropType, VNode } from 'vue'

const getIsDark: 'dark' | 'light' = 'dark'
const effect = computed(() => getIsDark)

const { menu_header_right } = crudConfig

const XHeaderMenu = defineComponent({
  name: 'XHeaderMenu',
  props: {
    isShowSearchMenu: {
      type: Boolean,
      default: true,
    },
    title: someType<string | VNode>(),
    page: {
      type: Object as PropType<CrudPageProps>,
      default: () => {},
    },
  },
  slots: Object as CustomSlotsType<{
    default?: () => any // 默认插槽
  }>,
  setup(props, { slots }) {
    const { t } = useLocale()

    const {
      option,
      reload,
      isShowHeaderSearch,
      permission,
      tableSize,
      handleShowDialogForm,
      onHandleExport,
      onHandleImport,
      onCurrentChange,
      onTableDensity,
      setUpMenuChange,
    } = useCrudInjectKey().value

    const {
      addBtn,
      importBtn,
      excelBtn,
      menuHeaderRight = menu_header_right,
      index,
      selection,
    } = option.value

    const wrappingRef = ref<HTMLElement>()
    const isReset = ref<boolean>(true)

    const checkAll = ref<boolean>(true)
    const isIndeterminate = ref<boolean>(false)
    const checkedCities = ref<number[]>([])
    const cities: number[] = []
    option.value.column.map((item, index) => {
      if (!item.setUpHide) {
        item.setUpHide = false
        checkedCities.value.push(index)
      }
      cities.push(index)
    })

    const handleCheckAllChange = (val: boolean) => {
      checkedCities.value = val ? cities : []
      isIndeterminate.value = false
      if (checkedCities.value) {
        option.value.column.forEach((item) => {
          item.setUpHide = !val
        })
      }
    }
    const handleCheckedCitiesChange = (value: string[]) => {
      const checkedCount = value.length
      checkAll.value = checkedCount === cities.length
      isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
    }

    const checkboxChange = (value: boolean, index: number) => {
      option.value.column[index].setUpHide = !value
    }

    const initSortable = () => {
      new Sortable(wrappingRef.value as HTMLElement, {
        swapThreshold: 1,
        animation: 250,
        handle: '.drag',
        onEnd: (el) => {
          const { oldIndex = 0, newIndex = 0 } = el
          arraySort(
            option.value.column.filter((item) => !item.hide) as ColumnProps[],
            'order'
          ).forEach((item: ColumnProps, index) => {
            if (index === oldIndex) {
              item.order = option.value.column.length - newIndex
            }
            // 往下
            if (oldIndex < newIndex && index > oldIndex && index <= newIndex) {
              item.order = option.value.column.length - index + 1
            }
            //  往上
            if (oldIndex > newIndex && index >= newIndex && index < oldIndex) {
              item.order = option.value.column.length - index - 1
            }
          })
          // console.log(oldIndex, newIndex, arraySort(column, 'order'))
          // 重新渲染
          reload.value = Math.random()
          // console.log('ss', el, column)
          // emit('update:activityOrders', sortedActivityOrder as number[])
        },
      })
    }

    onMounted(async () => {
      await nextTick()
      if (menuHeaderRight) {
        // 初始化拖拽排序
        initSortable()
      }
    })

    //  是否显示搜索菜单
    const handleSearchMenu = () => {
      isShowHeaderSearch.value = !isShowHeaderSearch.value
      tooltipDisabled.value = true
    }

    const fixedColor = ref<string>('#4E5969')
    const resetChange = () => {
      isReset.value = false
      option.value.column.map((item) => (item.fixed = undefined))
      fixedColor.value = 'var(--el-color-primary)'

      setTimeout(() => {
        isReset.value = true
        setTimeout(() => {
          fixedColor.value = '#4E5969'
        }, 600)
      }, 100)
    }

    const newIndex = ref<boolean>(index || false)
    const newSelection = ref<boolean>(selection || false)

    const tooltipDisabled = ref<boolean>(false)

    return () =>
      !props.title &&
      !(addBtn && permission?.addBtn) &&
      !(importBtn && permission?.importBtn) &&
      !(excelBtn && permission?.exportBtn) &&
      !menuHeaderRight &&
      !slots.default ? (
        <template></template>
      ) : (
        <div
          class={[
            'cjx-crud__header flex justify-between grid-items-center mb-20px',
          ]}
        >
          <div
            class={[
              'cjx-crud__header__left',
              'font-size-16px color-[var(--title-text-color)] font-500 whitespace-nowrap',
            ]}
          >
            {props.title}
          </div>
          <div class={['cjx-crud__header__right', 'flex']}>
            {addBtn && (
              <ElButton
                type="primary"
                // v-hasPermi={[permission?.addBtn || ['']]}
                onClick={() => handleShowDialogForm('create')}
                v-slots={{
                  icon: () => <CirclePlus />,
                }}
              >
                {t('action.add')}
              </ElButton>
            )}
            {importBtn && permission?.importBtn && (
              <ElButton
                class={'cjx-second-btn'}
                onClick={onHandleImport}
                // v-hasPermi={[permission?.importBtn || ['']]}
                v-slots={{
                  icon: () => <ImportOutlined />,
                }}
              >
                {t('action.import')}
              </ElButton>
            )}

            {excelBtn && permission?.exportBtn && (
              <ElButton
                class={'cjx-second-btn'}
                onClick={onHandleExport}
                // v-hasPermi={[permission?.exportBtn || ['']]}
                v-slots={{
                  icon: () => <ExcelOutlined />,
                }}
              >
                {t('action.export')}
              </ElButton>
            )}

            {/* 默认插槽 */}
            {slots.default?.()}

            {menuHeaderRight && (
              <div class={'cjx-crud__header__right_manipulate'}>
                {props.isShowSearchMenu && (
                  <ElTooltip
                    effect={effect.value}
                    content={
                      isShowHeaderSearch.value
                        ? t('table.hideSearchBar')
                        : t('table.displaySearchBar')
                    }
                    placement="top"
                    disabled={tooltipDisabled.value}
                    hide-after={0}
                  >
                    <ElIcon
                      class={'cursor-pointer'}
                      onClick={handleSearchMenu}
                      onMouseover={() => (tooltipDisabled.value = false)}
                      color="var(--cjx-dialog-icon-color)"
                      size={19}
                    >
                      {isShowHeaderSearch.value ? (
                        <ShowSearchBarOutlined />
                      ) : (
                        <HideSearchBarOutlined />
                      )}
                    </ElIcon>
                  </ElTooltip>
                )}
                <ElTooltip
                  effect={effect.value}
                  content={t('table.refresh')}
                  placement="top"
                  hide-after={0}
                >
                  <ElIcon
                    class={'ml15px cursor-pointer'}
                    color="var(--cjx-dialog-icon-color)"
                    size={19}
                    onClick={() => onCurrentChange(props.page.currentPage || 1)}
                  >
                    <RefreshOutlined />
                  </ElIcon>
                </ElTooltip>

                <ElPopover
                  placement="bottom-start"
                  trigger="click"
                  popper-style={{ padding: '0px' } as CSSProperties}
                  v-slots={{
                    reference: () => (
                      <ElIcon
                        class={'ml15px cursor-pointer'}
                        color="var(--cjx-dialog-icon-color)"
                        size={19}
                      >
                        <ElTooltip
                          effect={effect.value}
                          content={t('table.density')}
                          placement="top"
                          hide-after={0}
                        >
                          <DensityFilled />
                        </ElTooltip>
                      </ElIcon>
                    ),
                  }}
                >
                  <div class={'flex flex-col'}>
                    <el-button
                      bg
                      type={tableSize.value === 'small' ? 'primary' : ''}
                      onClick={() => onTableDensity('small')}
                    >
                      {t('table.compact')}
                    </el-button>

                    <el-button
                      class="!ml-0px"
                      type={tableSize.value === 'default' ? 'primary' : ''}
                      onClick={() => onTableDensity('default')}
                    >
                      {t('size.default')}
                    </el-button>

                    <el-button
                      class="!ml-0px"
                      type={tableSize.value === 'large' ? 'primary' : ''}
                      onClick={() => onTableDensity('large')}
                    >
                      {t('table.looseAndComfortable')}
                    </el-button>
                  </div>
                </ElPopover>

                <ElPopover
                  placement="bottom-start"
                  popper-style={
                    {
                      padding: '0px',
                      minWidth: '300px',
                      width: 'auto',
                    } as CSSProperties
                  }
                  trigger="click"
                  v-slots={{
                    reference: () => (
                      <ElIcon
                        class={'ml15px cursor-pointer'}
                        color="var(--cjx-dialog-icon-color)"
                        size={19}
                      >
                        <ElTooltip
                          effect={effect.value}
                          content={t('table.columnSettings')}
                          placement="top"
                          hide-after={0}
                        >
                          <SettingOutlined />
                        </ElTooltip>
                      </ElIcon>
                    ),
                  }}
                >
                  <div
                    class={
                      'flex flex-items-center justify-between b-b b-b-solid b-#E4E7ED'
                    }
                    style={{ padding: '10px 17px' } as CSSProperties}
                  >
                    <ElCheckbox
                      size="default"
                      class={'!mr-10px font-size-14px color-#333333'}
                      v-model={checkAll.value}
                      indeterminate={isIndeterminate.value}
                      onChange={handleCheckAllChange}
                    >
                      {t('table.columnDisplay')}
                    </ElCheckbox>

                    <ElCheckbox
                      size="default"
                      class={'!mr-10px'}
                      disabled={!index}
                      v-model={newIndex.value}
                      onChange={(value: boolean) =>
                        setUpMenuChange('index', value)
                      }
                    >
                      {t('table.numberColumn')}
                    </ElCheckbox>

                    <ElCheckbox
                      size="default"
                      class={'!mr-10px'}
                      disabled={!selection}
                      v-model={newSelection.value}
                      onChange={(value: boolean) =>
                        setUpMenuChange('selection', value)
                      }
                    >
                      {t('table.checkColumn')}
                    </ElCheckbox>

                    <ElButton
                      size="default"
                      type="primary"
                      link
                      onClick={resetChange}
                    >
                      {t('common.reset')}
                    </ElButton>
                  </div>

                  <ElCheckboxGroup
                    v-model={checkedCities.value}
                    onChange={handleCheckedCitiesChange}
                  >
                    <div
                      ref={wrappingRef}
                      class="max-h-260px overflow-y-auto"
                      style={{ padding: '5px 17px' } as CSSProperties}
                    >
                      {option.value.column?.map((item, index) => {
                        return (
                          !item.hide && (
                            <div class="flex flex-items-center" key={index}>
                              <ElIcon class={'cursor-pointer drag'} size={16}>
                                <DragOutlined></DragOutlined>
                              </ElIcon>

                              <ElCheckbox
                                size="default"
                                class="m-l-10px !h-28px"
                                onChange={(value: boolean) =>
                                  checkboxChange(value, index)
                                }
                                label={index}
                                value={index}
                              >
                                {item.label}
                              </ElCheckbox>

                              <div class={'ml-auto flex flex-items-center'}>
                                {/*<ElTooltip content={t('table.fixedLeft')} placement='bottom' hide-after={0}>*/}
                                {/*  */}
                                {/*</ElTooltip>*/}
                                <ElIcon
                                  size={18}
                                  color={
                                    item.fixed === 'left'
                                      ? 'var(--el-color-primary)'
                                      : fixedColor.value
                                  }
                                  class={'cursor-pointer'}
                                  onClick={() =>
                                    item.fixed !== 'left'
                                      ? (item.fixed = 'left')
                                      : (item.fixed = undefined)
                                  }
                                >
                                  {isReset.value && (
                                    <FixedOutlined></FixedOutlined>
                                  )}
                                </ElIcon>
                                <div
                                  class={'w-1px h-12px bg-#EAEFF4 m10px'}
                                ></div>
                                <ElIcon
                                  size={18}
                                  color={
                                    item.fixed === 'right'
                                      ? 'var(--el-color-primary)'
                                      : fixedColor.value
                                  }
                                  class={'cursor-pointer'}
                                  style={
                                    'transform: rotate(180deg) translateY(2px)'
                                  }
                                  onClick={() =>
                                    item.fixed !== 'right'
                                      ? (item.fixed = 'right')
                                      : (item.fixed = undefined)
                                  }
                                >
                                  {isReset.value && (
                                    <FixedOutlined></FixedOutlined>
                                  )}
                                </ElIcon>
                                {/*<ElTooltip content={t('table.fixedRight')} placement='bottom' hide-after={0}>*/}
                                {/*  */}
                                {/*</ElTooltip>*/}
                              </div>
                            </div>
                          )
                        )
                      })}
                    </div>
                  </ElCheckboxGroup>
                </ElPopover>
              </div>
            )}
          </div>
        </div>
      )
  },
})

export default XHeaderMenu
