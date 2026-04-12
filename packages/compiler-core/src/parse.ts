import { ConstantTypes, NodeTypes, createRoot, createSimpleExpression } from './ast'
import { Tokenizer, isWhitespace } from './tokenizer'
import { isSimpleIdentifier } from './utils'
import type { RootNode, SimpleExpressionNode, SourceLocation, TemplateChildNode } from './ast'

const stack: any[] = []

/**
 * 解析模板字符串并返回模板 AST。
 */
let currentRoot: RootNode | null = null

/**
 * 当前正在解析的元素标签的ast数据
 */
let currentOpenTag: any | null = null

let currentInput = ''

const tokenizer = new Tokenizer({
  ontext: (start, end) => {
    onText(getSlice(start, end), start, end)
  },
  oninterpolation(start, end) {
    console.log('解析到插值时被调用 oninterpolation', start, end)
    let innerStart = start + tokenizer.delimiterOpen.length
    let innerEnd = end - tokenizer.delimiterClose.length

    while (isWhitespace(currentInput.charCodeAt(innerStart))) {
      // 跳过空白字符，直到遇到非空白字符为止
      innerStart++
    }
    while (isWhitespace(currentInput.charCodeAt(innerEnd - 1))) {
      // 跳过空白字符，直到遇到非空白字符为止
      innerEnd--
    }
    const exp = getSlice(innerStart, innerEnd)
    addNode({
      type: NodeTypes.INTERPOLATION,
      content: createExp(exp, false, getLoc(innerStart, innerEnd)),
      loc: getLoc(start, end)
    })
  }
})

function createExp(
  content: SimpleExpressionNode['content'],
  isStatic: SimpleExpressionNode['isStatic'] = false,
  loc: SourceLocation,
  constType: ConstantTypes = ConstantTypes.NOT_CONSTANT
  // parseMode = ExpParseMode.Normal,
) {
  const exp = createSimpleExpression(content, isStatic, loc, constType)

  if (isSimpleIdentifier(content)) {
    exp.ast = null // 简单标识符无需解析
    return exp
  }

  try {
    exp.ast = {} // parseExpression(`(${content})`, options)
  } catch {
    exp.ast = false // 解析失败，设置为 false
    // emitError(ErrorCodes.X_INVALID_EXPRESSION, loc.start.offset, e.message)
  }

  return exp
}

/**
 * 添加节点到当前栈顶元素或根节点的子节点列表中。
 * @param node 节点对象，可以是任何类型的模板子节点
 */
function addNode(node: TemplateChildNode) {
  ;(stack[0] || currentRoot).children.push(node)
}

/**
 * 获取当前位置的源代码位置信息
 * @param start 开始位置索引
 * @param end 结束位置索引
 * @returns 返回一个包含开始和结束位置的对象，以及可选的原始字符串片段。
 */
function getLoc(start: number, end?: number): SourceLocation {
  return {
    start: tokenizer.getPos(start),
    // @ts-expect-error allow late attachment
    end: end == null ? end : tokenizer.getPos(end),
    source: end == null ? end : getSlice(start, end)
  }
}

/**
 * 设置位置信息的结束点
 * @param loc 位置信息对象
 * @param end 结束位置索引
 */
function setLocEnd(loc: SourceLocation, end: number) {
  loc.end = tokenizer.getPos(end)
  loc.source = getSlice(loc.start.offset, end)
}

/**
 * 处理文本内容
 * @param content 文本内容
 * @param start 开始位置索引
 * @param end 结束位置索引
 */
function onText(content: string, start: number, end: number) {
  console.log('onText', content, start, end)
  const parent = stack[0] || currentRoot
  const lastNode = parent.children[parent.children.length - 1]
  // console.log('lastNode', lastNode)
  if (lastNode?.type === NodeTypes.TEXT) {
    // 如果最后一个节点是文本类型，则将当前内容追加到该节点的content属性上
    // lastNode.content += content
    // setLocEnd(lastNode.loc, end)
  } else {
    parent.children.push({
      type: NodeTypes.TEXT,
      content,
      loc: getLoc(start, end)
    })
  }
}

/**
 * 从 currentInput 中获取指定范围的字符串切片
 *
 * @param start 切片开始的索引位置（包含）
 * @param end 切片结束的索引位置（不包含）
 * @returns 返回从 start 到 end 之间的字符串切片
 */
function getSlice(start: number, end: number) {
  return currentInput.slice(start, end)
}

function reset() {
  tokenizer.reset()
  currentOpenTag = null
  // currentProp = null
  // currentAttrValue = ''
  // currentAttrStartIndex = -1
  // currentAttrEndIndex = -1
  stack.length = 0
}

/**
 * 解析输入字符串的函数，将其转换为抽象语法树(AST)的根节点
 * @param input - 需要解析的字符串
 * @returns 返回解析后的抽象语法树(AST)的根节点
 */
export function baseParse(input: string) {
  reset()
  // 设置当前输入字符串
  currentInput = input

  const root = (currentRoot = createRoot([], input))

  tokenizer.parse(currentInput)
  console.log(JSON.stringify(root, null, 2))

  return root
}
