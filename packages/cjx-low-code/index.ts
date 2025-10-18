import installer from './defaults'
export { XConfigProvider, XCrud, XDialog, XForm, XEditTable, $XDialog } from '@cjx-low-code/components';
export type {
  TableOption,
  ColumnProps,
  CrudPageProps,
  BeforeOpen,
  CrudPermission,
  FormOption,
  FormColumnProps,
  FormItemType,
  FormTypeProps,
  EditTableProps,
  EditTableOption,
  DialogProps,
  DialogDirectiveInterface,
} from '@cjx-low-code/components';
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer

// export { default as dayjs } from 'dayjs'
