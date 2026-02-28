import { defineComponent, computed } from 'vue'
import XSearchForm from '../../../form/src/search'
import { formColumnValues } from '@cjx-low-code/components/form/src/interface'
import pick from '@cjx-low-code/components/_util/pick'
import omit from '@cjx-low-code/components/_util/omit'
import { useCrudInjectKey } from '../context'
import type { SearchFromProps } from '@cjx-low-code/components/form/src/interface'

const XHeaderSearch = defineComponent({
  name: 'XHeaderSearch',
  setup(_, { slots }) {
    const { option, search, onSearchReset, onSearchChange } =
      useCrudInjectKey().value

    const searchFormProps = computed<SearchFromProps>(() => {
      const newColumn = option.value.column?.filter(item => {
        return item.search || false
      }).map((item) => {
        return {
          ...omit(pick(item, formColumnValues), ['tip', 'labelTip']),
          span: item.searchSpan,
          placeholder: item.searchPlaceholder,
          clearable: item.searchClearable ?? true,
          type: item.searchType || item.type,
          prop: item.searchProp || item.prop,
          order: item.searchOrder,
          labelWidth: item.searchLabelWidth,
        }
      });
      
      return {
        option: {
          formSpan: option.value.searchSpan,
          labelWidth: option.value.searchLabelWidth,
          column: newColumn,
        },
        form: search,
        // queryBtn: hasPermi(permission?.queryBtn) ,
      };
    });

    return () => (
      <>
        <XSearchForm
          {...searchFormProps.value}
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
