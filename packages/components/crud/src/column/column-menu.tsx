import { defineComponent } from 'vue'
import { ElTableColumn } from 'element-plus'
import { useCrudInjectKey } from '../context'
import crudConfig from '../config'
import type { CustomSlotsType } from '../../../_util/type'
// import { useLocale } from '@cjx-low-code/hooks';

const { menu_fixed, menu_width, menu_header_align, menu_title } = crudConfig

// const { t } = useLocale();

const XColumnMenu = defineComponent({
  name: 'XColumnMenu',
  slots: Object as CustomSlotsType<{
    default?: any
  }>,
  setup(_, { slots }) {
    const {
      menuTitle,
      menuFixed = menu_fixed,
      menuWidth,
      menuMinWidth = menu_width,
      menuHeaderAlign = menu_header_align,
    } = useCrudInjectKey().value.option.value
    return () => (
      <>
        <ElTableColumn
          class-name={'font-size-14px'}
          fixed={menuFixed}
          label={menuTitle || menu_title}
          minWidth={menuMinWidth}
          width={menuWidth}
          align={menuHeaderAlign}
          prop="menu"
          v-slots={slots}
        ></ElTableColumn>
      </>
    )
  },
})

export default XColumnMenu
