import baseConfig, {
  removeImportStyleFromInputFilePlugin,
} from '../../scripts/rollup.base.js'

export default baseConfig(
  'cjx-low-code.antdv',
  'CjxLowCode.Antdv',
  removeImportStyleFromInputFilePlugin()
)
