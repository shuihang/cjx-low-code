import { computed, defineComponent, nextTick, onMounted, ref, watch, Comment } from 'vue'
import { ElButton, ElCard, ElIcon, ElPopover, ElTable } from 'element-plus'
import { useDraggable } from 'vue-draggable-plus'
import download from '@cjx-low-code/components/_util/download'
import { cloneDeep } from 'lodash-unified'
import XForm from '@cjx-low-code/components/form'
import { useCompRef, useLocale, useMessage } from '@cjx-low-code/hooks'
import { More } from '../../icon/index'
import pick from '../../_util/pick'
import { crudProps } from './interface'
// 头部搜索栏
import XHeaderSearch from './menu/headerSearch'
// 表格头组件
import XTableColumn from './column/column'
// 表格头部操作区域组件
import XHeaderMenu from './menu/headerMenu'
// 表格分页器组件
import XTablePage from './menu/tablePage'
// 弹窗表单
import XDiaLogForm from './dialog/dialog-form'
// 导入弹窗
import XDialogImport from './dialog/dialog-import'
import { useCrudProviderKey } from './context'
import crudConfig from './config'
import useId from './useId'
import type { SetUpInterface } from './context'
import type { CustomSlotsType } from '../../_util/type'
import { withInstallVue } from '../../_util/type'
import { isObject } from '../../_util/shared'
import type { TableColumRef } from './column/column'
import type { SortableEvent } from 'vue-draggable-plus'
import type {
  Arrayable,
  FormColumnProps,
} from '@cjx-low-code/components/form/src/interface'
import type {
  DialogFormType,
  ImportProps,
  Row,
  Scope,
  TableOption,
  TreeLoad,
} from './interface'
import type {
  Column,
  FormItemProp,
  FormValidateCallback,
  TableColumnCtx,
  TreeNode,
} from 'element-plus'
import type { CSSProperties, Ref, VNode, VNodeArrayChildren } from 'vue'
import { hasPermi } from './hasPermi'
import { ErrorCodes, defaultOnError, createError } from '../../_util/errors'

const onError = defaultOnError

const { row_key, dropRowClass, MAX_MENU_BTN_COUNT, export_file_suffix, draggable_class } = crudConfig;
const message = useMessage() // 消息弹窗


const crudEmits = {
  'current-change': (currentPage: number) => true,
  'size-change': (pageSize: number) => true,
  select: (selection: any[], row: any) => true,
  'selection-change': (selection: any[]) => true,
  'select-all': (selection: any[]) => true,
  /** 删除数据后点击确定触发该事件 */
  'row-del': (row: any, index: number) => true,
  /** 新增数据后点击确定触发该事件 */
  'row-save': (row: any, done: (isClear?: boolean) => void, index: number) =>
    true,
  /** 编辑数据后点击确定触发该事件 */
  'row-update': (row: any, done: (isClear?: boolean) => void, index: number) =>
    true,
  'row-click': (row: any, column: any, event: Event) => event instanceof Event,
  'search-reset': () => true,
  /**
   * 点击搜索后触发该事件
   * @param query 搜索表单数据
   * @param done 关闭搜索按钮loading动画
   * */
  'search-change': (
    data: {
      query: any
    },
    done: () => void
  ) => true,
  'before-open': (type: DialogFormType, form: any, done: () => void) => true,
  'tree-load': (row: any, treeNode: TreeNode, resolve: (arg0: any) => void) =>
    true,
  'handle-export': (
    exportFn: (
      exportApi: (params?: object) => Promise<any>,
      name: string
    ) => void
  ) => true,
  'handle-import': (importFn: (props: ImportProps) => void) => true,
  'update:form': (form: any) => true,
  'update:page': (page: any) => true,
  'update:search': (form: any) => true,
  // 'update:data': (data: any) => true,
  'dialog-close': (type: DialogFormType) => true,
  'radio-change': (row: any) => true,
  'sortable-change': (sortable: SortableEvent) => true,
  'dialog-tab-change': (index: number | string) => true,
  'on-load': () => Promise<any>,
}

/** 测试 */
type CustomStr<T extends string = ''> = `${string}${T}`

/**
 * 表格该项的插槽
 */
type TableSlot = {
  /**
   * @param [key: string] 插槽
   */
  [key: string]: Scope
}

/** 表单弹窗该项的插槽 */
export type FormSlot = Record<
  CustomStr<'Form'>,
  FormColumnProps & {
    /** 当前的弹窗类型 check/查看 create/新增 update/修改 */
    _XBoxType: DialogFormType
    /** 表单项的值 查看表单才有 */
    $value?: any
    /** 表单项的索引 查看表单才有 */
    $index?: number
  }
>

/** 表单分组的插槽 */
export type GroupFormSlot = Record<
  CustomStr<'GroupForm'>,
  {
    /** 当前的弹窗类型 check/查看 create/新增 update/修改 */
    _XBoxType: DialogFormType
  }
>

/** 搜索栏该项的插槽 */
type SearchSlot = Record<CustomStr<'Search'>, FormColumnProps>

/** 查看弹窗 tab的插槽 */
export type TabFormSlot = Record<CustomStr<'TabForm'>, never>

export type GroupLabelSlot = Record<
  CustomStr<'GroupLabel'>,
  {
    /** 当前的弹窗类型 check/查看 create/新增 update/修改 */
    _XBoxType: DialogFormType
  }
>

// type Last<T extends unknown[]> = T extends [infer F, ...infer R] ? Last<R> : never;
// type Blank = ' ' | '\n' | '\t';
// type MyTrimLeft<S extends string> = S extends `${Blank}${infer R}` ? MyTrimLeft<R> : S;

// const a: MyTrimLeft<' a'> = 'b'

const XCrud = withInstallVue(defineComponent({
  name: 'XCrud',
  inheritAttrs: false,
  props: crudProps(),
  slots: Object as CustomSlotsType<
    {
      /** 表格头部操作栏插槽 */
      headerMenu?: () => any
      /**
       * 操作栏插槽
       * @type {Scope={ row: any, $index: number }}
       * @param row 当前行数据
       * @param $index 当前行索引
       **/
      menu: (data: Scope) => any
      /** 表格搜索操作栏插槽 */
      searchMenu?: () => any
      /** 分页器插槽 */
      page?: () => any
      /** 表单插槽 如果用了该插槽，弹窗内容都只显示该插槽里的内容 */
      form?: () => any
      /** 表格插槽 */
      table?: () => any
      /** 导入弹窗头部插槽 */
      importHeader?: () => Promise<any>
      /** 表单头部位置插槽 */
      formHeader?: (props: { _XBoxType?: DialogFormType }) => any
      /** 表单弹窗底部位置插槽 */
      formFooter?: (props: { _XBoxType?: DialogFormType }) => any
    } & SearchSlot &
      FormSlot &
      GroupFormSlot &
      TableSlot &
      TabFormSlot &
      GroupLabelSlot
  >,
  // emits: Array as EmitsToProps<>,
  emits: crudEmits,
  setup(props, { slots, emit, expose, attrs }) {
    const { t } = useLocale() // 国际化
    const reload = ref<number>(Math.random())
    const mergedId = useId()

    const { form, permission, tableLoading } = props
    const option = props.option as TableOption
    const setUpMenu = ref<SetUpInterface>({
      index: option?.index || false,
      selection: option?.selection || false,
    })

    const setUpMenuChange = (key: keyof SetUpInterface, value: boolean) => {
      setUpMenu.value[key] = value
    }

    // 是否显示搜索栏
    const isShowHeaderSearch = ref<boolean>(true)

    // 加载子节点数据的函数，lazy 为 true 时生效
    const onTreeLoad: TreeLoad<object> = (row, treeNode, resolve) => {
      // console.log('treeLoad', row, treenode, resolve)
      emit('tree-load', row, treeNode, resolve)
    }

    // 页码切换
    const onCurrentChange = (pageSize: number) => {
      emit('update:page', props.page)
      emit('current-change', pageSize)
      //emit('on-load')
    }

    // 切换每页显示条目个数
    const onSizeChange = (pageSize: number) => {
      emit('update:page', props.page)
      emit('size-change', pageSize)
      //emit('on-load')
    }

    // 表格搜索栏清空事件
    const onSearchReset = () => {
      emit('search-reset')
    }

    // 表格搜索栏提交事件
    const onSearchChange = async (form: object, done: () => void) => {
      emit('update:search', form)
      emit('search-change', { query: form }, done)
      // console.log(props.onLoad,)
      props.onLoad.constructor.name === 'AsyncFunction' && await props.onLoad().then(() => done())
    }

    let $index: number | undefined = 0
    // 显示弹窗
    const showDialogForm = ref<boolean>(false);
    const boxType = ref<DialogFormType>('check');
   const cacheForm = cloneDeep(props.form)
    const currentForm = ref<any>({})
    const handleShowDialogForm = (type: DialogFormType, row?: Row<any>, index?: number) => {
      if (!isObject(props.form) && type !== 'check') onError(createError(ErrorCodes.WHEN_USING_THE_CRUD_COMPONENT_TO_ADD_AND_EDITING_FUNCTIONS_THE_FORM_PARAMETER_IS_REQUIRED_TO_BE_PASSED))

      if (type === 'create') {
        // formRef.value?.resetFields()
        currentForm.value = cloneDeep(cacheForm)
      } else {
        currentForm.value = cloneDeep(row)
      }

      $index = index
      boxType.value = type;

      props.form && emit('update:form', currentForm.value);

      // 打开前的回调，会暂停Dialog的打开，tableRow 该项的值，done用于打开Dialog,type为当前窗口的类型
      emit('before-open', boxType.value, currentForm.value, () => showDialogForm.value = true);
    };

    const formRef = useCompRef(XForm)
    // 弹窗表单 确认事件
    const onFormSubmitChange = (
      form: object,
      done: (isClear?: boolean) => void
    ) => {
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

    const rowClick = <T extends object>(
      row: T,
      column: TableColumnCtx<Column>,
      event: any
    ) => {
      emit('row-click', row, column, event)
    }

    // 弹窗表单 关闭事件
    const onCloseChange = () => {
      // console.log(form)
       emit('update:form', cacheForm || cloneDeep(props.form));
      showDialogForm.value = false
      emit('dialog-close', boxType.value)
    }

    // 导出
    const onHandleExport = () => {
      const ids: any[] = []
      selectionList.forEach((item) => {
        ids.push(item[rowKey])
      })

      emit(
        'handle-export',
        async (
          exportApi: (params?: object) => Promise<any>,
          name: string,
          params?: object
        ) => {
          // 导出的二次确认
          await message.exportConfirm()
          // 发起导出
          const data = await exportApi({
            ...props.search,
            ...params,
            ids: ids.join(','),
          })
          download.excel(data,  `${name}${export_file_suffix}`);
        }
      )
    }

    // 导入
    const importDialogNode = ref<VNode>(<span></span>)
    const onHandleImport = () => {
      emit('handle-import', (props: ImportProps) => {
        //  const importProps = ref(props)
        importDialogNode.value = XDialogImport(props, slots.importHeader)
        // watch(() => importProps.value, (val) => {
        //   // console.log('importApi', props.importApi)
        //   importDialogNode.value = ZtDialogImport(val, slots.importHeader)
        // }, { deep: true })
      })
    }

    // 密度
    const tableSize = ref<'large' | 'default' | 'small'>('default')
    const onTableDensity = (value: 'large' | 'default' | 'small') => {
      tableSize.value = value
    }

    const tableStyle = ref<CSSProperties>({})
    // const headerSearchRef = ref()
    const onExpandChange = (height: number) => {
      tableStyle.value.height = `calc(100% - ${
        isCard ? 'var(--el-card-padding)' : '0px'
      } - ${height + (isShowSearchMenu.value ? 12 : 0)}px)`
    }

    const onDialogTabChange = (index: number | string) => {
      emit('dialog-tab-change', index)
    }

    useCrudProviderKey(
      computed(() => {
        return {
          // ...option as TableOption,
          option: computed(() => props.option as TableOption),
          // ...page,
          permission,
          reload,
          isShowHeaderSearch,
          search: computed(() => ({ ...props.search })),
          showDialogForm,
          boxType,
          formRef: formRef as unknown as Ref<any>,
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
          onDialogTabChange,
        }
      })
    )

    const elTagWrappingRef = ref<HTMLElement>() // elTable 容器 Ref

    const { rowKey = row_key, sortable, isCard = true } = option as TableOption
    // 是否卡片显示

    const loading = ref<boolean>(tableLoading)
    watch(
      () => props.tableLoading,
      (newVal) => {
        loading.value = newVal
      }
    )

    // 配置项有变时重新初始化table组件
    watch(
      () => option,
      () => {
        reload.value = Math.random()
        console.log('reload')
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
        console.log(
          'sortable',
          document.querySelector(`.${mergedId}`),
          props.data
        )
        useDraggable(elTagWrappingRef.value, ref(props.data), {
          handle: `.${draggable_class}`,
          customUpdate: (event) => {
            // console.log(111, event)
            // const newData = JSON.parse(JSON.stringify(props.data || []))
            // const currRow = newData.splice(event.oldIndex, 1)[0]
            // newData.splice(event.newIndex, 0, currRow)
            // newData.map((item, index) => (item.sort = index + 1))
            // emit('update:data', newData)
            emit('sortable-change', event)
          },
        })
      }
    })

    // 表格多选
    let selectionList: any[] = []
    const selectChange = (selection: any[]) => {
      emit('selection-change', selection)
      selectionList = selection
    }

    const select = (selection: any[], row: any) => {
      emit('select', selection, row)
    }

    const selectAll = (selection: any[]) => {
      emit('select-all', selection)
    }

    const sortChange = () => {
      // console.log(11);
    }

    // 行删除
    const rowDel = (row: Row<any>, index: number) => {
      emit('row-del', row, index)
    }

    // 是否显示搜索栏
    const isShowSearchMenu = ref<boolean>(false)
    try {
      option!.column!.map((item) => {
        if (item.search) {
          throw new Error('需要显示搜索栏')
        }
      })
    } catch {
      isShowSearchMenu.value = true
    }

    const refTableColumn = ref<TableColumRef>()
    const refTable = ref<InstanceType<typeof ElTable>>()

    const exposeFn = {
      // ...refTable.value,
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
      updateKeyChildren: (key: string, data: any[]) =>
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
      openDialogForm: (type: DialogFormType, row?: Row<any>, index?: number) =>
        handleShowDialogForm(type, row, index),
      /**
       * 用于单选表格
       * @param id 表格数据里对应的rowKey默认为id
       */
      toggleRowRadio: (id: any) => refTableColumn.value!.setRadioCurrent(id),
      /**
       * 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则可直接设置这一行选中与否
       * @param row 表格对应的行数据
       * @param selected 是否选中
       */
      toggleRowSelection: (row: any, selected: boolean) => {
        console.log('toggleRowSelection', row, selected)
        refTable.value!.toggleRowSelection(row, selected)
      },
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
      validateV2: (disableForm = true) =>
        formRef.value?.validateV2(disableForm),
      /** 移除该表单项的校验结果 */
      clearValidate: (props?: Arrayable<FormItemProp>) =>
        formRef.value?.clearValidate(props),
      /** 验证具体的某个字段*/
      validateField: (props?: Arrayable<FormItemProp>) =>
        formRef.value?.validateField(props),
      /** 手动设置表单不可编辑 */
      setFormDisabled: () => formRef.value?.setFormDisabled(),
      /** 手动设置表单可编辑 */
      setFormAvailable: () => formRef.value?.setFormAvailable(),
      /** 刷新导入弹窗 */
      handleImport: onHandleImport,
    }

    // 暴露出去的组件方法
    expose(exposeFn)

    const menuBtnVNode = (scope: Scope) => {
      // console.log(hasPermi(permission?.viewBtn || ['']))
      // v-hasPermi={[permission?.viewBtn || ['']]}
      return (
        <>
          {option?.viewBtn &&  hasPermi(permission?.viewBtn, scope) && (
            <ElButton
              link
              type="primary"
              onClick={() =>
                handleShowDialogForm('check', scope.row, scope.$index)
              }
            >
              {t('action.check')}
            </ElButton>
          )}
          {option?.updateBtn && hasPermi(permission?.editBtn, scope) && (
            <ElButton
              link
              type="primary"
              onClick={() =>
                handleShowDialogForm('update', scope.row, scope.$index)
              }
            >
              {t('action.edit')}
            </ElButton>
          )}
          {option?.delBtn && hasPermi(permission?.delBtn, scope) && (
            <ElButton
              link
              type="danger"
              onClick={() => rowDel(scope.row, scope.$index)}
            >
              {t('action.delete')}
            </ElButton>
          )}
        </>
      )
    }

    const getMenuVNode = (menuBtnVNode: VNode, slots: VNode[]) => {
      const defMenuNode = menuBtnVNode.children ? (menuBtnVNode.children as VNodeArrayChildren).filter(item => item) : []
      const slotNode = slots.filter(item => item.type !== Comment)

      if (defMenuNode.length + slotNode.length <= MAX_MENU_BTN_COUNT)
        return (
          <>
            {menuBtnVNode} {slots}
          </>
        )

      if (defMenuNode.length >= MAX_MENU_BTN_COUNT)
        return (
          <>
            {menuBtnVNode}
            <ElPopover
              v-slots={{
                reference: () => (
                  <ElIcon
                    size={16}
                    class={'m-l-16px'}
                    color={'var(--el-color-primary)'}
                  >
                    <More />
                  </ElIcon>
                ),
              }}
            >
              <div class={'flex flex-col cjx-crud-popover-btn-group'}>
                {slots}
              </div>
            </ElPopover>
          </>
        )

      return (
        <>
          {menuBtnVNode}
          {slotNode.slice(0, MAX_MENU_BTN_COUNT - defMenuNode.length)}
          <ElPopover
            v-slots={{
              reference: () => (
                <ElIcon
                  class={'m-l-16px'}
                  size={16}
                  color={'var(--el-color-primary)'}
                >
                  <More />
                </ElIcon>
              ),
            }}
          >
            <div class={'flex flex-col cjx-crud-popover-btn-group'}>
              {slotNode.slice(MAX_MENU_BTN_COUNT - defMenuNode.length, slotNode.length)}
            </div>
          </ElPopover>
        </>
      )
    }

    return {
      ...exposeFn,
      mergedId,
      menuBtnVNode,
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
      currentForm
    }
  },
  render() {
    if (!this.$props.option) {
      return <span class={'text-red-500'}>
        {createError(ErrorCodes.THE_OPTION_PARAMETER_OF_CRUD_COMPONENTS_IS_MANDATORY)}
      </span>
    }

    const CardComponent = this.isCard ? ElCard : 'div'
    const { class: $class } = this.$attrs

    return (
      <div
        class={[
          `cjx-crud h-100%`,
          $class,
          this.mergedId,
          this.$props.option.sortable && 'sortable',
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
            <XHeaderSearch v-slots={this.$slots} />
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
                  boxSizing: 'border-box',
                } as CSSProperties,
              }
            : {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxSizing: 'border-box',
                } as CSSProperties,
              })}
        >
          {/* 表格头部操作栏 */}
          <XHeaderMenu
            isShowSearchMenu={this.isShowSearchMenu}
            title={this.$props.option.title}
            page={this.$props.page}
            v-slots={{
              default: this.$slots.headerMenu,
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
                'treeProps',
              ])}
              onSelect={this.select}
              onSelectionChange={this.selectChange}
              onSelectAll={this.selectAll}
              onSortChange={this.sortChange}
              onRowClick={this.rowClick}
              row-class-name={this.$props.rowClassName}
              cell-class-name={(data) => this.$props.cellClassName ? (this.$props.cellClassName(data)) : (draggable_class)}
              load={this.onTreeLoad}
              size={this.tableSize}
              header-cell-style={() =>
                ({
                  background: 'var(--cjx-crud-table-head-bg-color)',
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
                      <div
                        class={'cjx-table-column-menu flex flex-items-center'}
                      >
                        {this.getMenuVNode(
                          this.menuBtnVNode(scope),
                          this.$slots.menu(scope)
                        )}
                      </div>
                    ) : (
                      <>{this.menuBtnVNode(scope)}</>
                    ),
                }}
              />
            </ElTable>
          )}

          {/* 分页 */}
          {this.$props.page && (
            <XTablePage page={this.$props.page} v-slots={this.$slots.page} />
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
  },
}))

export {
  XCrud
}

export default XCrud
