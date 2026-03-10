import registerBaseField from './registerBaseField'
import GroupField from './groupField'

const registerFieldTypesFn = () => {
  return {
    Input: registerBaseField('input'),
    Select: registerBaseField('select'),
    Group: GroupField
  }
}

export const registerFieldTypes = registerFieldTypesFn()
