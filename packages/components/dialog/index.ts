import { withInstall } from '../_util/type'
import Dialog from './src/index'
export { $XDialog } from './src/dialog'
export type { DialogProps } from './src/index'
export type { DialogDirectiveInterface } from './src/dialog'

export const XDialog = withInstall(Dialog)


export default XDialog
