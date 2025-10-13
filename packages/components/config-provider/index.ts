import { withInstall } from '../_util/type'
import ConfigProvider from './src/config-provider'
export { provideGlobalConfig } from './src/hooks/use-global-config'
export type { ConfigProviderContext } from './src/interface'

export const XConfigProvider = withInstall(ConfigProvider)

export default XConfigProvider