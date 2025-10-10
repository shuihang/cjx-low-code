import { defineComponent } from 'vue'

const RenderVNode = defineComponent({
  props: {
    vNode: {
      type: [Object, String],
      quailified: true,
    },
  },
  render() {
    return this.vNode
  },
})

export default RenderVNode
