import installer from './defaults'
export { XCrud, XDialog, XForm, XEditTable, $XDialog } from '@cjx-low-code/components';
export type {
  TableOption,
  ColumnProps,
  CrudPageProps,
  BeforeOpen,
  CrudPermission,
  EditTableProps,
  EditTableOption,
  DialogProps,
  DialogDirectiveInterface
} from '@cjx-low-code/components';
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer

// export { default as dayjs } from 'dayjs'
