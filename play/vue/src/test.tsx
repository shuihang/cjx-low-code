import { Input } from '@cjx-low-code/antdv'
import { connect, createSchemaField } from '@cjx-low-code/vue'
import {
  CheckboxGroup,
  Input as ElInput,
  FormItem,
  RadioGroup,
  Rate,
  Select
} from '@cjx-low-code/element-plus'
import ATestComp from './testComp.vue'

const { SchemaField, SchemaFieldEnum } = createSchemaField({
  components: {
    Input,
    Select,
    ElInput,
    Rate,
    RadioGroup,
    CheckboxGroup,
    FormItem,
    ATestComp: connect(ATestComp)
  }
})

const Test = () => {
  return (
    <SchemaField>
      <SchemaField.String
        title="qq"
        name="dd"
        component="Input.Search"
        componentProps={{ type: 'text', enterButton: true }}
        decorator="FormItem"
        slots={{ prefix: 'prefix' }}
      />
    </SchemaField>
  )
}
