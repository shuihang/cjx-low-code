<template>
  <XForm v-model:form="form" :option="formOptions" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch
} from '@cjx-low-code/element-plus'
import { createForm } from '@cjx-low-code/core'
import { createSchemaField } from '@cjx-low-code/vue'
import type { FormOption } from 'cjx-low-code'
import useEditorStore from '@/store/modules/editor'

const { components } = storeToRefs(useEditorStore())

const { SchemaField, defineSchema } = createSchemaField({
  components: {
    Input,
    Select,
    Radio,
    RadioGroup,
    Checkbox,
    CheckboxGroup,
    Switch,
    FormItem
  }
})

const form = ref({})
const formOptions = computed<FormOption>(() => ({
  menuBtn: false,
  labelWidth: 110,
  column: components.value
}))
</script>
