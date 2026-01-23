import { isString } from './shared'

export enum ErrorCodes {
  USEDIALOG_MUST_BE_CALLED_IN_SETUP,
  THE_OPTION_PARAMETER_OF_CRUD_COMPONENTS_IS_MANDATORY,
  WHEN_USING_THE_CRUD_COMPONENT_TO_ADD_AND_EDITING_FUNCTIONS_THE_FORM_PARAMETER_IS_REQUIRED_TO_BE_PASSED,
  COMPONENT_IS_REQUIRED,
  ASYNCHRONOUS_COMPONENT_LOADING_FAILED,
  FAILED_TO_RENDER_DIALOG
}

export const errorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.USEDIALOG_MUST_BE_CALLED_IN_SETUP]: 'useDialog must be called in setup',
  [ErrorCodes.THE_OPTION_PARAMETER_OF_CRUD_COMPONENTS_IS_MANDATORY]: 'The option parameter of CRUD components is mandatory',
  [ErrorCodes.WHEN_USING_THE_CRUD_COMPONENT_TO_ADD_AND_EDITING_FUNCTIONS_THE_FORM_PARAMETER_IS_REQUIRED_TO_BE_PASSED]: 'When using the CRUD component to add, and edit functions, the form parameter must be passed',
  [ErrorCodes.COMPONENT_IS_REQUIRED]: 'Component is required',
  [ErrorCodes.ASYNCHRONOUS_COMPONENT_LOADING_FAILED]: 'Asynchronous component loading failed',
  [ErrorCodes.FAILED_TO_RENDER_DIALOG]: 'Failed to render dialog'
}

export interface CompilerError extends SyntaxError {
  code: number | string
}

export interface CoreCompilerError extends CompilerError {
  code: ErrorCodes
}


type InferCompilerError<T> = T extends ErrorCodes
  ? CoreCompilerError
  : CompilerError
  
export function defaultOnError(error: CompilerError) {
  throw error
}


export function createError<T extends number>(
  code: T,
  messages?: { [code: number]: string },
): InferCompilerError<T>

export function createError<T extends number>(
  code: T,
  additionalMessage?: string,
): InferCompilerError<T>

export function createError<T extends number>(
  code: T,
  messages?: { [code: number]: string },
  additionalMessage?: string,
): InferCompilerError<T> {
  // 处理不同的参数情况
  let baseMessage: string | { [code: number]: string }
  let extraMessage: string;

  
  if (isString(messages)) {
    // 第二个参数是字符串的情况
    baseMessage = errorMessages[code] || '';
    extraMessage = messages;
  } else {
    // 第二个参数是消息对象的情况
    baseMessage = (messages || errorMessages)[code] || '';
    extraMessage = additionalMessage || '';
  }
  
  const msg = `${baseMessage}${extraMessage}`;
  const error = new SyntaxError(msg) as InferCompilerError<T>;
  error.code = code;
  return error;
}
