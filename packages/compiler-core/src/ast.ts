export enum NodeTypes {
  /**
   * 根节点，包含整个模板的解析结果
   */
  ROOT,
  /**
   * 文本节点，表示一个文本内容
   */
  TEXT,

  /**
   * 插值表达式节点，表示一个模板中的插值内容 {{ }}
   */
  INTERPOLATION,

  /**
   * 二元表达式节点，表示一个包含两个操作数的表达式
   */
  BINARY_EXPRESSION,

  /**
   * 简单表达式节点，表示一个简单的 JavaScript 表达式
   */
  SIMPLE_EXPRESSION,
  /**
   * 算术表达式 `+`、`-`、`*`、`/`、`%`
   */
  ArithmeticExpression,

  /**
   *
   * 比较表达式 `==`、`!=`、`===`、`!==`、`<`、`>`、`<=`、`>=`
   */
  ComparisonExpression,

  /**
   * 逻辑表达式 `&& ||`
   */
  LogicalExpression,

  /**
   * 三目表达式 `? :`
   */
  TernaryExpression,

  // containers / 容器
  /**
   * 复合表达式节点，表示一个包含多个子表达式的表达式
   */
  COMPOUND_EXPRESSION,
  /**
   * 条件表达式节点，表示一个包含多个分支的条件表达式
   */
  IF,
  /**
   * 条件分支节点，表示一个条件表达式的分支
   */
  IF_BRANCH,
  /**
   * 循环表达式节点，表示一个包含多个迭代的循环表达式
   */
  FOR,
  /**
   * 文本调用节点，表示一个调用文本内容的表达式
   */
  TEXT_CALL

  // codegen / 代码生成
}

// 所有节点共有的基础属性
export interface BaseNode {
  type: NodeTypes
  /**
   * 源代码位置信息，用于调试和错误报告
   */
  loc: SourceLocation
}

/**
 * 源代码位置信息，用于调试和错误报告
 */
export interface SourceLocation {
  /**
   * 源代码的开始位置
   */
  start: Position
  /**
   * 源代码的结束位置
   */
  end: Position
  /**
   * 源代码的文本内容
   */
  source?: string | number
}

export interface Position {
  /**
   * 从文件开始计算的字符偏移量
   */
  offset: number // 从文件开始
  /**
   * 行号。
   */
  line: number
  /**
   * 列号。
   */
  column: number
}

type ASTNode =
  | ArithmeticExpression // * / + -
  | ComparisonExpression // > < >= <= === !==
  | LogicalExpression // && ||
  | TernaryExpression // ? :

// 算术：返回 number（或 string）
interface ArithmeticExpression {
  type: NodeTypes.ArithmeticExpression
  operator: '*' | '/' | '+' | '-'
  left: ASTNode
  right: ASTNode
}

// 比较：返回 boolean
interface ComparisonExpression {
  type: NodeTypes.ComparisonExpression
  operator: '>' | '<' | '>=' | '<=' | '===' | '!=='
  left: ASTNode
  right: ASTNode
}

// 逻辑：返回 boolean，有短路特性
interface LogicalExpression {
  type: NodeTypes.LogicalExpression
  operator: '&&' | '||'
  left: ASTNode
  right: ASTNode
}

/**
 * 三目表达式 `? :`
 */
interface TernaryExpression {
  type: NodeTypes.TernaryExpression
  condition: ASTNode
  trueBranch: ASTNode
  falseBranch: ASTNode
}

export interface SimpleExpressionNode extends BaseNode {
  type: NodeTypes.SIMPLE_EXPRESSION
  content: string
  isStatic: boolean
  constType: ConstantTypes
  /**
   * - `null`表示表达式是一个不需要解析的简单标识
   * - `false` 表示存在解析错误
   */
  ast?: ASTNode | null | false
  /**
   * 解析为函数参数的表达式将跟踪函数体内声明的标识符。
   */
  identifiers?: string[]
  isHandlerKey?: boolean
}

export type ExpressionNode = SimpleExpressionNode | CompoundExpressionNode

// 1. 根节点
export interface RootNode extends BaseNode {
  type: NodeTypes.ROOT
  tag?: string
  source?: string
  children: TemplateChildNode[]
  helpers: Set<symbol>
  components: string[]
  directives: string[]
  cached: number
  temps: number
  codegenNode?: TemplateChildNode
}

// 2. 文本节点
export interface TextNode extends BaseNode {
  type: NodeTypes.TEXT
  content: string
}

// 3. 插值节点
export interface InterpolationNode extends BaseNode {
  type: NodeTypes.INTERPOLATION
  content: ExpressionNode // 插值中的变量名，如 "name"
}

// 4. 复合表达式节点（在转换阶段生成）
export interface CompoundExpressionNode extends BaseNode {
  type: NodeTypes.COMPOUND_EXPRESSION
  children: (string | TemplateChildNode)[] // 可以是字符串或节点
}

export type TemplateChildNode = TextNode | InterpolationNode

const locStub: SourceLocation = {
  start: { line: 1, column: 1, offset: 0 },
  end: { line: 1, column: 1, offset: 0 },
  source: ''
}

/**
 * 静态类型有几个级别。
 * 更高的水平意味着更低的水平。例如，可以串化的节点总是可以被提升并跳过以进行补丁。
 */
export enum ConstantTypes {
  /**
   * 不能被提升或字符串化的表达式。
   */
  NOT_CONSTANT = 0,
  /**
   * 可以被提升，但不能被字符串化。
   */
  CAN_SKIP_PATCH,
  /**
   * 可以被提升并跳过以进行补丁。
   */
  CAN_HOIST,
  /**
   * 可以被提升并被字符串化。
   */
  CAN_STRINGIFY
}

export function createRoot(children: TemplateChildNode[], source = ''): RootNode {
  return {
    type: NodeTypes.ROOT,
    source,
    children,
    helpers: new Set(),
    components: [],
    directives: [],
    // hoists: [],
    // imports: [],
    cached: 0,
    temps: 0,
    codegenNode: undefined,
    loc: locStub
  }
}

/**
 * 创建一个简单的表达式节点
 * @param content 表达式的内容
 * @param isStatic 是否静态表达式
 * @param loc 源代码位置信息
 * @param constType 静态类型
 * @returns
 */
export function createSimpleExpression(
  content: SimpleExpressionNode['content'],
  isStatic: SimpleExpressionNode['isStatic'] = false,
  loc: SourceLocation = locStub,
  constType: ConstantTypes = ConstantTypes.NOT_CONSTANT
): SimpleExpressionNode {
  return {
    type: NodeTypes.SIMPLE_EXPRESSION,
    loc,
    content,
    isStatic,
    constType: isStatic ? ConstantTypes.CAN_STRINGIFY : constType
  }
}
