import { defineComponent } from 'vue'

const RenderSlots = defineComponent({
  name: 'RenderSlots',
  inheritAttrs: false,
  setup(props, { slots }) {
    return () => <>{slots.default()}</>
  }
})

export default RenderSlots
