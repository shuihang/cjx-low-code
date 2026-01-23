import { defineComponent } from 'vue';
import { useFormInjectKey } from '../context'
import { InitFormTemplate } from '../init'
import { arrayType } from "../../../_util/type";
import type { CustomSlotsType } from "../../../_util/type";
import type { FormColumnProps } from '../interface'

export default defineComponent({
  name: 'ZtFormColumn',
  props: {
    column: arrayType<FormColumnProps[]>(),
  },
  slots: Object as CustomSlotsType<{}>,
  render() {
    const {isView, ...otherProps } = useFormInjectKey().value
    return InitFormTemplate({...this.$props, ...otherProps, isView: isView.value, slots: this.$slots})
  }
})