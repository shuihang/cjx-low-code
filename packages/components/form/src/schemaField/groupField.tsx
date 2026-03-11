import { withInstall } from '../../../_util/type'
import type { GroupField } from './interface'
import type { FunctionalComponent } from 'vue'

export type GroupFieldProps = Omit<GroupField, 'column' | 'order' | 'type'>

export type GroupFieldFC = FunctionalComponent<GroupFieldProps> & {
  isSchemaField: boolean
}

const GroupFieldComponent: GroupFieldFC = () => {
  return null
}

GroupFieldComponent.isSchemaField = true
GroupFieldComponent.displayName = 'XSchemaField.Group'
export default withInstall(GroupFieldComponent)
