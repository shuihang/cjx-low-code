import { defineComponent, onMounted, onUnmounted, provide, toRef } from 'vue'
import { objectType } from '../shared'
import { FormSymbol } from '../shared/context'
import h from '../shared/h'
import { Fragment } from '../shared/fragment'
import type { Form } from '@cjx-low-code/core'

export default defineComponent({
  name: 'FormProvider',
  props: {
    form: objectType<Form>()
  },
  setup(props, { slots }) {
    const formRef = toRef(props, 'form')
    provide(FormSymbol, formRef)

    onMounted(() => {
      props.form.onMount()
    })

    onUnmounted(() => {
      props.form.onUnmount()
    })

    return () => h(Fragment, {}, slots)
  }
})
