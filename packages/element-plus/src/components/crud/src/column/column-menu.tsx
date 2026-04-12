import { defineComponent } from 'vue'
import { ElTableColumn } from 'element-plus'
import { useLocale } from '../../../../hooks'
import { useCrudInjectKey } from '../context'
import crudConfig from '../config'
import type { CustomSlotsType } from '@cjx-low-code/shared'

const {
  menuFixed: defaultMenuFixed,
  menuWidth: defaultMenuWidth,
  menuHeaderAlign: defaultMenuHeaderAlign
} = crudConfig

const XColumnMenu = defineComponent({
  name: 'XColumnMenu',
  slots: Object as CustomSlotsType<{
    default?: () => void
  }>,
  setup(_, { slots }) {
    const { t } = useLocale()

    const {
      menuTitle,
      menuFixed = defaultMenuFixed,
      menuWidth,
      menuMinWidth = defaultMenuWidth,
      menuHeaderAlign = defaultMenuHeaderAlign
    } = useCrudInjectKey().value.option.value
    return () => (
      <>
        <ElTableColumn
          class-name={'font-size-14px'}
          fixed={menuFixed}
          label={menuTitle || t('table.action')}
          minWidth={menuMinWidth}
          width={menuWidth}
          align={menuHeaderAlign}
          prop="menu"
          v-slots={slots}
        ></ElTableColumn>
      </>
    )
  }
})

export default XColumnMenu
