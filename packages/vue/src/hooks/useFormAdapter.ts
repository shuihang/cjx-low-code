import { getCurrentInstance, nextTick, ref } from 'vue'
import { useForm } from './useForm'
import type { FormModelOptions } from '../types'

export const useFormAdapter = (options: FormModelOptions) => {
  const { validateKey = 'validate', validateFieldsKey = 'validateFields' } = options
  const formRef = useForm()
  const model = ref(options.model || {})
  const instance = getCurrentInstance()

  if (formRef?.value) {
    formRef.value.watchValuse = (form, field) => {
      model.value = {
        ...form.state.values
      }
      formRef.value?.validateFields && formRef.value.validateFields!([field.path])
    }
    nextTick(() => {
      if (instance?.exposed) {
        formRef.value.validate = () => instance.exposed?.[validateKey]!()
        formRef.value.validateFields = (names: string[]) =>
          instance.exposed?.[validateFieldsKey]!(names)
      }
    })
  }

  return {
    formRef,
    model
  }
}
