import { defineComponent, watchEffect } from 'vue'
import XSearchForm from '../../../form/src/search'
import { formColumnValues } from '@cjx-low-code/components/form/src/interface'
import pick from '@cjx-low-code/components/_util/pick'
import omit from '@cjx-low-code/components/_util/omit'
import { useCrudInjectKey } from '../context'
import type {
  FormColumnProps,
  SearchFromProps,
} from '@cjx-low-code/components/form/src/interface'

const XHeaderSearch = defineComponent({
  name: 'XHeaderSearch',
  // props: {
  //   form: {
  //     type: Object,
  //     default: () => {}
  //   }
  // },
  setup(_, { slots }) {
    const { option, search, reload, onSearchReset, onSearchChange } =
      useCrudInjectKey().value

    let newColumn: FormColumnProps[] | undefined, props: SearchFromProps

    watchEffect(() => {
      newColumn = option.value.column
        ?.filter((item) => {
          return item.search || false
        })
        .map((item) => {
          return {
            ...omit(pick(item, formColumnValues), ['tip', 'labelTip']),
            span: item.searchSpan,
            slot: item.searchSlot,
            placeholder: item.searchPlaceholder,
            clearable: item.searchClearable ?? true,
            type: item.searchType || item.type,
            order: item.searchOrder,
            labelWidth: item.searchLabelWidth,
          }
        })

      props = {
        option: {
          formSpan: option.value.searchSpan,
          labelWidth: option.value.searchLabelWidth,
          column: newColumn,
        },
        form: search,
        // queryBtn: permission?.queryBtn,
      }
    })

    return () => (
      <>
        <XSearchForm
          key={reload.value}
          {...props}
          onReset={onSearchReset}
          onSubmit={onSearchChange}
          v-slots={{
            ...slots,
            menu: slots.searchMenu,
          }}
        ></XSearchForm>
      </>
    )
  },
})

export default XHeaderSearch
