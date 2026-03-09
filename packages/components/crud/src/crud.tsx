import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { ElCard, ElTable } from 'element-plus'
import { useDraggable } from 'vue-draggable-plus'
import { cloneDeep } from 'lodash-unified'
import download from '@cjx-low-code/components/_util/download'
import XForm from '@cjx-low-code/components/form'
import { useCompRef, useMessage } from '@cjx-low-code/hooks'
import pick from '../../_util/pick'
import { withInstallVue } from '../../_util/type'
import { isObject } from '../../_util/shared'
import { ErrorCodes, createError, defaultOnError } from '../../_util/errors'
import { crudProps } from './interface'
import XHeaderSearch from './menu/headerSearch'
import XTableColumn from './column/column'
import XHeaderMenu from './menu/headerMenu'
import XTablePage from './menu/tablePage'
import XDiaLogForm from './dialog/dialog-form'
import XDialogImport from './dialog/dialog-import'
import { useCrudProviderKey } from './context'
import crudConfig from './config'
import useId from './useId'
import { crudEmits } from './emits'
import { getMenuVNode, menuBtnVNode } from './handelMenu'
import type { AnyARecord } from 'dns'
import type { AnyObject } from '../../_util/type'
import type { HandleShowDialogForm, RowDeltype } from './handelMenu'
import type { CrudSlotType } from './slots'
import type { SetUpInterface } from './context'
import type { TableColumRef } from './column/column'
import type { Arrayable } from '@cjx-low-code/components/form/src/interface'
import type {
  CrudPageProps,
  DialogFormType,
  ImportProps,
  Scope,
  TableOption,
  TreeLoad
} from './interface'
import type { Column, FormItemProp, FormValidateCallback, TableColumnCtx } from 'element-plus'
import type { CSSProperties, VNode } from 'vue'

const onError = defaultOnError

const { defaultRowKey, dropRowClass, exportFileSuffix, draggableClass } = crudConfig
const message = useMessage() // 消息弹窗

const XCrud = withInstallVue(
  defineComponent({
    name: 'XCrud',
    inheritAttrs: false,
    props: crudProps(),
    slots: Object as CrudSlotType,
    emits: crudEmits,
    setup(props, { slots, emit, expose }) {
      const reload = ref<number>(Math.random())
      const mergedId = useId()

      const { permission, tableLoading } = props
      const option = props.option as TableOption
      const setUpMenu = ref<SetUpInterface>({
        index: option?.index || false,
        selection: option?.selection || false
      })

      const setUpMenuChange = (key: keyof SetUpInterface, value: boolean) => {
        setUpMenu.value[key] = value
      }

      // 是否显示搜索栏
      const isShowHeaderSearch = ref<boolean>(true)

      // 加载子节点数据的函数，lazy 为 true 时生效
      const onTreeLoad: TreeLoad<object> = (row, treeNode, resolve) => {
        emit('tree-load', row, treeNode, resolve)
      }

      // 页码切换
      const onCurrentChange = (pageSize: number) => {
        const updatedPage = {
          ...props.page,
          currentPage: pageSize
        }
        emit('update:page', updatedPage)
        emit('current-change', pageSize)
        emit('on-load')
      }

      // 切换每页显示条目个数
      const onSizeChange = (pageSize: number) => {
        const updatedPage = {
          ...props.page,
          pageSize
        }
        emit('update:page', updatedPage)
        emit('size-change', pageSize)
        emit('on-load')
      }

      // 表格搜索栏清空事件
      const onSearchReset = () => {
        const updatedPage = {
          ...props.page,
          currentPage: 1
        }
        emit('update:page', updatedPage)
        emit('update:search', {})
        emit('search-reset')
        emit('on-load')
      }

      const updatePage = (page: CrudPageProps) => {
        const updatedPage = {
          ...props.page,
          ...page
        }
        emit('update:page', updatedPage)
      }

      // 表格搜索栏提交事件
      const onSearchChange = async (form: AnyObject, done: () => void) => {
        emit('update:search', form)
        emit('search-change', { query: form }, done)
      }

      let $index: number | undefined = 0
      // 显示弹窗
      const showDialogForm = ref<boolean>(false)
      const boxType = ref<DialogFormType>('check')
      const cacheForm = cloneDeep(props.form)
      const currentForm = ref<AnyObject>({})
      const handleShowDialogForm: HandleShowDialogForm = (type, row, index) => {
        if (!isObject(props.form) && type !== 'check')
          onError(
            createError(
              ErrorCodes.WHEN_USING_THE_CRUD_COMPONENT_TO_ADD_AND_EDITING_FUNCTIONS_THE_FORM_PARAMETER_IS_REQUIRED_TO_BE_PASSED
            )
          )

        if (type === 'create') {
          currentForm.value = cloneDeep(cacheForm)
        } else {
          currentForm.value = cloneDeep(row) as AnyObject
        }

        $index = index
        boxType.value = type

        props.form && emit('update:form', currentForm.value)

        // 打开前的回调，会暂停Dialog的打开，tableRow 该项的值，done用于打开Dialog,type为当前窗口的类型
        emit('before-open', boxType.value, currentForm.value, () => (showDialogForm.value = true))
      }

      const formRef = useCompRef(XForm)
      // 弹窗表单 确认事件
      const onFormSubmitChange = (form: object, done: (isClear?: boolean) => void) => {
        const emitStr = boxType.value === 'create' ? 'save' : 'update'
        emit(
          // @ts-ignore
          `row-${emitStr}`,
          form,
          (isClear = true) => {
            done(isClear)
            if (isClear) {
              showDialogForm.value = false
              formRef.value?.resetFields()
            }
          },
          $index
        )
      }

      const rowClick = (row: AnyObject, column: TableColumnCtx<Column>, event: Event) => {
        emit('row-click', row, column, event)
      }

      // 弹窗表单 关闭事件
      const onCloseChange = () => {
        emit('update:form', cacheForm || cloneDeep(props.form))
        showDialogForm.value = false
        emit('dialog-close', boxType.value)
      }

      // 导出
      const onHandleExport = () => {
        const ids: (string | number)[] = []
        selectionList.forEach((item) => {
          ids.push(item[rowKey])
        })

        emit(
          'handle-export',
          async (exportApi: (params?: object) => Promise<any>, name: string, params?: object) => {
            // 导出的二次确认
            await message.exportConfirm()
            // 发起导出
            const data = await exportApi({
              ...props.search,
              ...params,
              ids: ids.join(',')
            })
            download.excel(data, `${name}${exportFileSuffix}`)
          }
        )
      }

      // 导入
      const importDialogNode = ref<VNode>(<span></span>)
      const onHandleImport = () => {
        emit('handle-import', (props: ImportProps) => {
          importDialogNode.value = XDialogImport(props, slots.importHeader)
        })
      }

      const tableSize = ref<'large' | 'default' | 'small'>('default')
      const onTableDensity = (value: 'large' | 'default' | 'small') => {
        tableSize.value = value
      }

      const tableStyle = ref<CSSProperties>({})
      const onExpandChange = (height: number) => {
        tableStyle.value.height = `calc(100% - ${isCard ? 'var(--el-card-padding)' : '0px'} - ${
          height + (isShowSearchMenu.value ? 12 : 0)
        }px)`
      }

      const onDialogTabChange = (index: number | string) => {
        emit('dialog-tab-change', index)
      }

      useCrudProviderKey(
        computed(() => {
          return {
            option: computed(() => props.option as TableOption),
            permission,
            reload,
            isShowHeaderSearch,
            showDialogForm,
            boxType,
            formRef,
            tableSize,
            onCurrentChange,
            onSizeChange,
            onSearchReset,
            onSearchChange,
            onFormSubmitChange,
            onCloseChange,
            onTableDensity,
            handleShowDialogForm,
            onHandleExport,
            onHandleImport,
            setUpMenuChange,
            onExpandChange,
            onDialogTabChange
          }
        })
      )

      const elTagWrappingRef = ref<HTMLElement>() // elTable 容器 Ref

      const { rowKey = defaultRowKey, sortable, isCard = true } = option

      const loading = ref<boolean>(tableLoading)
      watch(
        () => props.tableLoading,
        (newVal) => {
          loading.value = newVal
        }
      )

      // 监听影响 table 布局的配置项变化
      watch(
        () => [
          option.column,
          option.height,
          option.maxHeight,
          option.border,
          option.treeProps,
          option.defaultExpandAll,
          option.lazy,
          option.index,
          option.indexWidth,
          option.selection,
          option.selectionWidth,
          option.menu,
          option.menuWidth,
          option.menuMinWidth,
          option.menuFixed,
          option.showOverflowTooltip
        ],
        () => {
          nextTick(() => {
            refTable.value?.doLayout()
          })
        },
        { deep: true }
      )

      onMounted(async () => {
        emit('on-load')
        await nextTick()
        if (sortable) {
          elTagWrappingRef.value = document.querySelector(
            `.${mergedId} ${dropRowClass}`
          ) as HTMLElement
          useDraggable(elTagWrappingRef.value, ref(props.data), {
            handle: `.${draggableClass}`,
            customUpdate: (event) => {
              emit('sortable-change', event)
            }
          })
        }
      })

      // 表格多选
      let selectionList: AnyObject[] = []
      const selectChange = (selection: AnyObject[]) => {
        emit('selection-change', selection)
        selectionList = selection
      }

      const select = (selection: AnyObject[], row: AnyObject) => {
        emit('select', selection, row)
      }

      const selectAll = (selection: AnyObject[]) => {
        emit('select-all', selection)
      }

      const sortChange = () => {
        // console.log(11);
      }

      // 行删除
      const rowDel: RowDeltype = (row, index) => {
        emit('row-del', row, index)
      }

      // 是否显示搜索栏
      const isShowSearchMenu = computed(() => option?.column?.some((item) => item.search) ?? false)

      const refTableColumn = ref<TableColumRef>()
      const refTable = ref<InstanceType<typeof ElTable>>()

      const exposeFn = {
        /**
         * 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局
         */
        doLayout: () => refTable.value?.doLayout(),
        /**
         * 适用于 lazy Table, 需要设置 rowKey, 更新 key children
         * @param key 表格数据里对应的rowKey默认为id
         * @param data 表格数据
         * @returns
         */
        updateKeyChildren: (key: string, data: AnyObject[]) =>
          refTable.value?.updateKeyChildren(key, data),
        /**
         * 关闭表单弹窗
         */
        closeDialogForm: onCloseChange,
        /**
         * 打开弹窗
         * @param type 弹窗类型check/查看，create/新增，update/修改
         * @param row 表格对应的行数据
         * @param index 对应表格的第几行
         */
        openDialogForm: (type: DialogFormType, row?: AnyObject, index?: number) =>
          handleShowDialogForm(type, row, index),
        /**
         * 用于单选表格
         * @param id 表格数据里对应的rowKey默认为id
         */
        toggleRowRadio: (id: number | string) => refTableColumn.value!.setRadioCurrent(id),
        /**
         * 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则可直接设置这一行选中与否
         * @param row 表格对应的行数据
         * @param selected 是否选中
         */
        toggleRowSelection: (row: AnyObject, selected: boolean) =>
          refTable.value!.toggleRowSelection(row, selected),
        /** 用于多选表格，清空用户的选择  */
        clearSelection: () => refTable.value!.clearSelection(),
        /**
         * 用于表单弹窗 表单校验的 下个版本即将淘汰请使用validateV2
         */
        validate: (callback?: FormValidateCallback | undefined) =>
          formRef.value?.validate(callback),
        /**
         * 用于表单弹窗 滚动到指定的字段
         */
        scrollToField: (prop: FormItemProp) => formRef.value?.scrollToField(prop),
        /**
         * 表单校验
         */
        validateV2: (disableForm = true) => formRef.value?.validateV2(disableForm),
        /** 移除该表单项的校验结果 */
        clearValidate: (props?: Arrayable<FormItemProp>) => formRef.value?.clearValidate(props),
        /** 验证具体的某个字段*/
        validateField: (props?: Arrayable<FormItemProp>) => formRef.value?.validateField(props),
        /** 手动设置表单不可编辑 */
        setFormDisabled: () => formRef.value?.setFormDisabled(),
        /** 手动设置表单可编辑 */
        setFormAvailable: () => formRef.value?.setFormAvailable(),
        /** 刷新导入弹窗 */
        handleImport: onHandleImport
      }

      // 暴露出去的组件方法
      expose(exposeFn)

      return {
        ...exposeFn,
        mergedId,
        menuBtnVNode: (scope: Scope) =>
          menuBtnVNode({ scope, permission, option, handleShowDialogForm, rowDel }),
        getMenuVNode,
        isShowSearchMenu,
        isShowHeaderSearch,
        tableStyle,
        refTable,
        reload,
        loading,
        rowKey,
        option,
        select,
        selectChange,
        selectAll,
        sortChange,
        rowClick,
        onTreeLoad,
        tableSize,
        refTableColumn,
        setUpMenu,
        showDialogForm,
        importDialogNode,
        isCard,
        boxType,
        currentForm,
        updatePage
      }
    },
    render() {
      if (!this.$props.option) {
        return (
          <span class={'text-red-500'}>
            {createError(ErrorCodes.THE_OPTION_PARAMETER_OF_CRUD_COMPONENTS_IS_MANDATORY)}
          </span>
        )
      }

      const CardComponent = this.isCard ? ElCard : 'div'
      const { class: $class } = this.$attrs

      return (
        <div
          class={[
            `cjx-crud h-100%`,
            $class,
            this.mergedId,
            this.$props.option.sortable && 'sortable'
          ]}
        >
          {this.isShowSearchMenu && (
            <CardComponent
              {...(this.isCard ? { shadow: 'never' } : {})}
              class={'mb-12px !b-none'}
              {...(this.isCard ? { 'body-class': '!p-b-0px' } : {})}
              v-show={this.isShowHeaderSearch}
            >
              {/* 表格搜索栏 */}
              <XHeaderSearch v-slots={this.$slots} form={this.$props.search} />
            </CardComponent>
          )}

          <CardComponent
            {...(this.isCard ? { shadow: 'never' } : {})}
            class={'!b-none flex flex-col h-100%'}
            style={this.isShowHeaderSearch ? this.tableStyle : { height: '100%' }}
            {...(this.isCard
              ? {
                  'body-style': {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxSizing: 'border-box'
                  } as CSSProperties
                }
              : {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxSizing: 'border-box'
                  } as CSSProperties
                })}
          >
            {/* 表格头部操作栏 */}
            <XHeaderMenu
              isShowSearchMenu={this.isShowSearchMenu}
              title={this.$props.option.title}
              page={this.$props.page}
              v-slots={{
                default: this.$slots.headerMenu
              }}
            />
            {/* 表格内容 */}
            {this.$slots.table?.() || (
              <ElTable
                ref={'refTable'}
                key={this.reload}
                width="100%"
                v-loading={this.loading}
                row-key={this.rowKey}
                data={this.$props.data}
                span-method={this.$props.spanMethod}
                show-summary={!!this.$props.summaryMethod}
                summary-method={this.$props.summaryMethod}
                {...pick(this.option, [
                  'defaultExpandAll',
                  'lazy',
                  'height',
                  'maxHeight',
                  'border',
                  'highlightCurrentRow',
                  'treeProps'
                ])}
                onSelect={this.select}
                onSelectionChange={this.selectChange}
                onSelectAll={this.selectAll}
                onSortChange={this.sortChange}
                onRowClick={this.rowClick}
                row-class-name={this.$props.rowClassName}
                cell-class-name={(data) =>
                  this.$props.cellClassName ? this.$props.cellClassName(data) : draggableClass
                }
                load={this.onTreeLoad}
                size={this.tableSize}
                header-cell-style={() =>
                  ({
                    background: 'var(--cjx-crud-table-head-bg-color)'
                  } as CSSProperties)
                }
              >
                <XTableColumn
                  ref={'refTableColumn'}
                  onRadioChange={(v) => this.$emit('radio-change', v)}
                  setUpMenu={this.setUpMenu}
                  v-slots={{
                    ...this.$slots,
                    menu: (scope: Scope) =>
                      this.$slots.menu ? (
                        <div class={'cjx-table-column-menu flex flex-items-center'}>
                          {this.getMenuVNode(this.menuBtnVNode(scope), this.$slots.menu(scope))}
                        </div>
                      ) : (
                        <>{this.menuBtnVNode(scope)}</>
                      )
                  }}
                />
              </ElTable>
            )}

            {/* 分页 */}
            {this.$props.page && (
              <XTablePage
                page={this.$props.page}
                v-slots={this.$slots.page}
                updatePage={this.updatePage}
              />
            )}
          </CardComponent>

          {/*表单弹窗*/}
          <XDiaLogForm
            showDialogForm={this.showDialogForm}
            form={this.$props.form || this.currentForm}
            v-slots={this.$slots}
            class={this.$props.dialogClassName}
          />

          {/* 导入弹窗 */}
          {this.importDialogNode}
        </div>
      )
    }
  })
)

export { XCrud }

export default XCrud
