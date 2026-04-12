import baseConfig, {
  removeImportStyleFromInputFilePlugin
} from '../../scripts/rollup.base.js'

export default baseConfig(
  'cjx-low-code.antd',
  'CjxLowCode.Antd',
  removeImportStyleFromInputFilePlugin()
)
