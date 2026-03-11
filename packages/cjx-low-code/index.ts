import installer from './defaults'
export {
  XConfigProvider,
  XCrud,
  XDialog,
  XForm,
  XSchemaField,
  XEditTable,
  $XDialog
} from '@cjx-low-code/components'
export type {
  TableOption,
  ColumnProps,
  CrudPageProps,
  BeforeOpen,
  CrudPermission,
  FormOption,
  SchemaItem,
  SchemaItemArray,
  FormColumnProps,
  FormItemType,
  FormTypeProps,
  EditTableProps,
  EditTableOption,
  DialogProps,
  DialogDirectiveInterface
} from '@cjx-low-code/components'
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer
