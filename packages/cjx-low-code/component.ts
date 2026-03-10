import XCrud from '@cjx-low-code/components/crud/index'
import XForm from '@cjx-low-code/components/form/index'
import XSchemaField from '@cjx-low-code/components/form/src/schemaField'
import XEditTable from '@cjx-low-code/components/editTable/index'
import XDialog from '@cjx-low-code/components/dialog/index'
import type { Plugin } from 'vue'

export default [XCrud, XForm, XSchemaField, XEditTable, XDialog] as unknown as Plugin[]
