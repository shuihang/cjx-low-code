import type { SortableEvent } from 'vue-draggable-plus'
import type { CrudPageProps, DialogFormType, ImportProps } from './interface'
import type { AnyObject } from '../../_util/type'
import type { Column, TableColumnCtx, TreeNode } from 'element-plus'

/* eslint-disable @typescript-eslint/no-unused-vars */
export const crudEmits = {
  'current-change': (currentPage: number) => true,
  'size-change': (pageSize: number) => true,
  select: (selection: AnyObject[], row: AnyObject) => true,
  'selection-change': (selection: AnyObject[]) => true,
  'select-all': (selection: AnyObject[]) => true,
  /** 删除数据后点击确定触发该事件 */
  'row-del': (row: AnyObject, index: number) => true,
  /** 新增数据后点击确定触发该事件 */
  'row-save': (row: AnyObject, done: (isClear?: boolean) => void, index: number) => true,
  /** 编辑数据后点击确定触发该事件 */
  'row-update': (row: AnyObject, done: (isClear?: boolean) => void, index: number) => true,
  'row-click': (row: AnyObject, column: TableColumnCtx<Column>, event: Event) =>
    event instanceof Event,
  'search-reset': () => true,
  /**
   * 点击搜索后触发该事件
   * @param query 搜索表单数据
   * @param done 关闭搜索按钮loading动画
   * */
  'search-change': (
    data: {
      query: AnyObject
    },
    done: () => void
  ) => true,
  'before-open': (type: DialogFormType, form: AnyObject, done: () => void) => true,
  'tree-load': (row: AnyObject, treeNode: TreeNode, resolve: (arg0: AnyObject[]) => void) => true,
  'handle-export': (
    exportFn: (exportApi: (params?: object) => Promise<AnyObject>, name: string) => void
  ) => true,
  'handle-import': (importFn: (props: ImportProps) => void) => true,
  'update:form': (form: AnyObject) => true,
  'update:page': (page: CrudPageProps) => true,
  'update:search': (form: AnyObject) => true,
  // 'update:data': (data: any) => true,
  'dialog-close': (type: DialogFormType) => true,
  'radio-change': (row: AnyObject) => true,
  'sortable-change': (sortable: SortableEvent) => true,
  'dialog-tab-change': (index: number | string) => true,
  'on-load': () => true
}
/* eslint-enable @typescript-eslint/no-unused-vars */
