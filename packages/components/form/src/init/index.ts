import { ref } from 'vue'
import {
  RenderFormVNode,
  RenderSearchFormVNode,
  RenderViewFormVNode,
} from './initFormTamplate'
import type { SearchFormProps, TemplateProps } from './initFormTamplate'
// import { Inject, Context } from './decorator';

export function InitSearchFormVNode(argv: SearchFormProps) {
  return new RenderSearchFormVNode(argv).init()
}

export function InitFormTemplate(argv: TemplateProps) {
  const { isView, ztBoxType } = argv
  const argvWithColumn = {
    ...argv,
    column: argv.column || [],
    formSpan: argv.formSpan || 24,
    collapseStatus: argv.collapseStatus || ref(false),
    checkColumnSpan: argv.checkColumnSpan || 24,
  }
  return isView || ztBoxType?.value === 'check'
    ? new RenderViewFormVNode(argvWithColumn).init()
    : new RenderFormVNode(argvWithColumn).init()
}
