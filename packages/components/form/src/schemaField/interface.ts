import type { FormColumnProps, FormItemType, FormModelValueType } from '../interface'

export type PropKey<F extends object> = keyof F

export type BaseField<
  F extends object = FormModelValueType,
  P extends PropKey<F> = PropKey<F>
> = Omit<FormColumnProps<F, P>, 'type'>

export interface NormalField<
  F extends object = FormModelValueType,
  P extends PropKey<F> = PropKey<F>
> extends BaseField<F, P> {
  type: FormItemType
}

export interface GroupField<
  F extends object = FormModelValueType,
  P extends PropKey<F> = PropKey<F>
> extends BaseField<F, P> {
  type: 'group'
  column: SchemaItemArray<F, P>
}

export interface CollapseField<
  F extends object = FormModelValueType,
  P extends PropKey<F> = PropKey<F>
> extends BaseField<F, P> {
  type: 'collapse'
  column: SchemaItemArray<F, P>
}

/**
 * 表单布局类型枚举
 * @type {'group'}
 * @description 定义了所有可用的表单布局类型：
 * - group: 分组布局
 * - collapse: 折叠布局
 */
export type SchemaLayoutMap = {
  group: GroupField
  collapse: CollapseField
}

export type SchemaProvide<
  F extends object = FormModelValueType,
  P extends PropKey<F> = PropKey<F>
> = NormalField<F, P>

export type SchemaLayout = SchemaLayoutMap[SchemaLayoutType]

export type SchemaLayoutType = keyof SchemaLayoutMap

export const schemaLayoutValues: SchemaLayoutType[] = ['group']

export type SchemaItem<F extends object = FormModelValueType, P extends PropKey<F> = PropKey<F>> =
  | GroupField<F, P>
  | NormalField<F, P>

export type SchemaItemArray<
  F extends object = FormModelValueType,
  P extends PropKey<F> = PropKey<F>
> = Array<SchemaItem<F, P>>
