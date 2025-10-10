import { computed, defineComponent, onUnmounted } from 'vue'
import { ElPagination } from 'element-plus'
import { useCrudInjectKey } from '../context'
import type { CustomSlotsType } from '@cjx-low-code/components/_util/type'
import type { PropType } from 'vue'
// import pick from "@cjx-low-code/components/_util/pick";
import type { CrudPageProps } from '../interface'

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
  },
  setup(props, { slots }) {
    // 获取注入的值
    const { onCurrentChange, onSizeChange } = useCrudInjectKey().value

    // const newPage = ref({...props.page})

    const newPageSize = computed<number>({
      get() {
        return props.page.pageSize || 10
      },
      set(val) {
        // eslint-disable-next-line vue/no-mutating-props
        props.page.pageSize = val
      },
    })

    const newCurrentPage = computed<number>({
      get() {
        return props.page.currentPage || 1
      },
      set(val) {
        // eslint-disable-next-line vue/no-mutating-props
        props.page.currentPage = val
      },
    })
    //  处理每页显示条数改变
    const handleSizeChange = (pageSize: number) => {
      // console.log('onSizeChange', pageSize)
      newCurrentPage.value = 1
      newPageSize.value = pageSize
      onSizeChange(pageSize)
    }
    // 处理当前页改变
    const handleCurrentChange = (currentPage: number) => {
      // console.log('onCurrentChange', currentPage)
      newCurrentPage.value = currentPage
      onCurrentChange(currentPage)
    }

    onUnmounted(() => {
      newCurrentPage.value = 1
    })
    // console.log(props, 'pagination')

    // 返回渲染的函数
    return () => (
      <>
        {slots.default?.() ||
          ((props.page.total || 0) > 0 && (
            <ElPagination
              class={'justify-end p-t-50px m-t-a'}
              v-model:currentPage={newCurrentPage.value}
              v-model:pageSize={newPageSize.value}
              layout={
                props.page?.layout?.join(',') ||
                'total, sizes, prev, pager, next, jumper'
              }
              background={props.page.background || true}
              pageSizes={props.page.pageSizes || [10, 20, 30, 50, 100]}
              total={props.page.total}
              pagerCount={props.page.pagerCount || 7}
              onCurrentChange={handleCurrentChange}
              onSizeChange={handleSizeChange}
            />
          ))}
      </>
    )
  },
})

export default ZtTablePage
