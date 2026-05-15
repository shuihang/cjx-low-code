<template>
  <FormProvider :form="form">
    <Form>
      <SchemaField :schema="components" />
    </Form>
  </FormProvider>
</template>

<script setup lang="ts">
import { Form } from '@cjx-low-code/element-plus'
import { createForm } from '@cjx-low-code/core'
import { FormProvider } from '@cjx-low-code/vue'
import useEditorStore from '@/store/modules/editor'
import { SchemaField } from '@/defaultFormTemplates'

const editorStore = useEditorStore()
const components = computed(() => editorStore.components)
console.log(components.value[0])

const form = createForm({})
</script>
