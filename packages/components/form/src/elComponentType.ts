export type ElDatePickerEmitType = {
  /** 当用户确认值或点击外部时触发 */
  onChange: (value: number | string | Date | number[] | string[] | Date[]) => void;
  /** 在组件 Input 失去焦点时触发 */
  onBlur: (event: FocusEvent) => void;
  /** 在组件 Input 获得焦点时触发  */
  onFocus: (event: FocusEvent) => void;
  /** 可清空的模式下用户点击清空按钮时触发 */
  onClear: () => void;
  /** 在日历所选日期更改时触发 仅用于 range */
  onCalendarChange: (val: [Date, null | Date]) => void;
  /** 当日期面板改变时触发。 */
  onPanelChange: (date: Date | [Date, Date], mode: 'month' | 'year', view?: string) => void;
  /** 当 DatePicker 的下拉列表出现/消失时触发 */
  onVisibleChange: (visibility: boolean) => void
}

export type ElTreeSelectType = {
  onNodeClick: (node: any, value: any, treeNode: any, change: any ) => void
}

/*
 * 下拉选择器
 */
export type ElSelectType = {
  /** 选中值发生变化时触发 */
  onChange: (value: any) => void;
  /** 下拉框出现/隐藏时触发 */
  onVisibleChange: (visibility: boolean) => void;
  /** 多选模式下移除tag时触发 */
  onRemoveTag: (tagValue: any) => void;
  /** 可清空的单选模式下用户点击清空按钮时触发 */
  onClear: () => void;
  /** 当 input 失去焦点时触发 */
  onBlur: (event: FocusEvent) => void;
  /** 当 input 获得焦点时触发 */
  onFocus: (event: FocusEvent) => void;
  /** 下拉滚动时触发 2.9.4 */
  onPopupScroll: (data: { scrollTop: number, scrollLeft: number }) => void;
}
