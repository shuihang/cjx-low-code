import GroupContainer from '../layout/group-container'
import pick from '../../../_util/pick'
import type { SchemaLayout } from '../interface'
import type { FormRenderContext, FormRenderOptions } from './FormRenderDecorator'
import type { Slot, VNode } from 'vue'

export default function createLayoutForm(
  item: SchemaLayout,
  index: number,
  context: FormRenderContext,
  options: FormRenderOptions,
  slots: (VNode | undefined)[] | undefined | Record<string, Slot>
): VNode | undefined {
  if (
    context._handelColumnDisPlay &&
    !context._handelColumnDisPlay({
      col: item,
      schemaField: context.schemaField,
      form: context.newForm.value,
      xBoxType: context.xBoxType?.value
    })
  )
    return

  return (
    <GroupContainer
      key={index}
      props={pick(item, ['label', 'prop'])}
      xBoxType={context.xBoxType?.value}
      v-slots={{ default: () => slots }}
    />
  )
}
