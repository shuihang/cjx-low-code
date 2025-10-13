import { defineComponent, renderSlot } from 'vue'
import { configProviderProps } from './interface'
import { provideGlobalConfig } from './hooks/use-global-config'

export default defineComponent({
  name: 'XConfigProvider',
  props: configProviderProps(),
  setup(props, { slots }) {
    // console.log('XConfigProvider', props)
    const config = provideGlobalConfig(props)

    return () => renderSlot(slots, 'default', { config: config?.value })
  }
})