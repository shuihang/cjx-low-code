import { defineComponent } from 'vue'

export const Fragment = '#fragment'

export const FragmentComponent = defineComponent({
  name: 'Fragment',
  render() {
    return this.$slots.default?.()
  }
})
