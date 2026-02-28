import { computed, defineComponent, onUnmounted } from 'vue'
import { ElPagination } from 'element-plus'
import { useCrudInjectKey } from '../context'
import type { CustomSlotsType } from '@cjx-low-code/components/_util/type'
import type { PropType } from 'vue'
import type { CrudPageProps } from '../interface'
import crudConfig from '../config'

const { page_layout, pager_count, page_sizes, page_background } = crudConfig

const ZtTablePage = defineComponent({
  name: 'ZtTablePage',
  slots: Object as CustomSlotsType<{
    default: () => any // 默认插槽
  }>,
  props: {
    page: {
      type: Object as PropType<CrudPageProps>,
      default: () => {},
    },
    updatePage: {
      type: Function as PropType<(page: CrudPageProps) => void>,
      default: () => {},
    },
  },
  setup(props, { slots }) {
    // 获取注入的值
    const { onCurrentChange, onSizeChange } = useCrudInjectKey().value

    const newPageSize = computed<number>({
      get() {
        return props.page.pageSize || 10
      },
      set(val) {
        props.updatePage({
          pageSize: val,
        })
      },
    })

    const newCurrentPage = computed<number>({
      get() {
        return props.page.currentPage || 1
      },
      set(val) {
        props.updatePage({
          currentPage: val,
        })
      },
    })
    //  处理每页显示条数改变
    const handleSizeChange = (pageSize: number) => {
      newCurrentPage.value = 1
      newPageSize.value = pageSize
      onSizeChange(pageSize)
    }
    // 处理当前页改变
    const handleCurrentChange = (currentPage: number) => {
      newCurrentPage.value = currentPage
      onCurrentChange(currentPage)
    }

    onUnmounted(() => {
      newCurrentPage.value = 1
    })

    // 返回渲染的函数
    return () => (
      <>
        {slots.default?.() ||
          ((props.page.total || 0) > 0 && (
            <ElPagination
              class={'justify-end p-t-50px m-t-a'}
              v-model:currentPage={newCurrentPage.value}
              v-model:pageSize={newPageSize.value}
              layout={props.page?.layout?.join(',') || page_layout.join(',')}
              background={props.page.background || page_background}
              pageSizes={props.page.pageSizes || page_sizes}
              total={props.page.total}
              pagerCount={props.page?.pagerCount || pager_count}
              onCurrentChange={handleCurrentChange}
              onSizeChange={handleSizeChange}
            />
          ))}
      </>
    )
  },
})

export default ZtTablePage
