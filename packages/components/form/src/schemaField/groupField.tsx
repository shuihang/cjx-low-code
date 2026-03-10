import { withInstall } from '../../../_util/type'
import { useFormInjectKey } from './context'
import type { GroupFieldProps } from './context'
import type { FunctionalComponent } from 'vue'

export type GroupFieldFC = FunctionalComponent<GroupFieldProps> & {
  isSchemaField: boolean
}

const GroupField: GroupFieldFC = (props) => {
  const schemaField = useFormInjectKey()
  console.log('schemaField', schemaField)
  schemaField.value.addGroupField({
    ...props
  })
  return null
}

GroupField.isSchemaField = true
GroupField.displayName = 'XSchemaField.Group'
export default withInstall(GroupField)
