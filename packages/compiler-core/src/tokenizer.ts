import type { Position } from './ast'

export enum State {
  Text,

  // 插值表达式处理状态
  /**
   * 处理插值表达式开始标记 ``{{
   */
  InterpolationOpen,
  /**‘
   * 处理插值表达式内容
   */
  Interpolation,
  /**
   * 处理插值表达式结束标记 `}}`
   */
  InterpolationClose
}

enum CharCodes {
  /**
   * `\n` 换行符
   */
  NewLine = 0xa, // "\n"
  /**
   * `\f` 换页符
   */
  FormFeed = 0xc, // "\f"
  /**
   * `\r` 回车符
   */
  CarriageReturn = 0xd, // "\r"
  /**
   * ` ` 空格
   */
  Space = 0x20, // " "
  /**
   * `!` 在DSl模板中 。
   */
  ExclamationMark = 0x21, // "!"
  /**
   * `#` 在DSl模板中 插槽指令的标识符，例如`<div #slot></div>`中的`#slot`部分。
   */
  Number = 0x23, // "#"
  /**
   * `&` 在DSl模板中 实体引用的开始标记，例如`&amp;`。
   */
  Amp = 0x26, // "&"
  /**
   *  `'` 在DSl模板中 单引号。
   */
  SingleQuote = 0x27, // "'"
  /**
   * `"` 在DSl模板中 双引号。
   */
  DoubleQuote = 0x22, // '"'
  /**
   * `
   */
  GraveAccent = 96, // "`"
  /** `0` */
  Zero = 0x30, // "0"
  /**
   * `9`
   */
  Nine = 0x39, // "9"
  /**
   * `;``
   */
  Semi = 0x3b, // ";"

  /**
   * `=`。在DSl模板中 等于号。
   */
  Eq = 0x3d, // "="
  /**
   * `>`。在DSl模板中 大于号。
   */
  Gt = 0x3e, // ">"
  /**
   * `?` 在DSl模板中 问号。
   */
  Questionmark = 0x3f, // "?"
  /** `A` */
  UpperA = 0x41, // "A"
  /** `a` */
  LowerA = 0x61, // "a"
  /** `F` */
  UpperF = 0x46, // "F"
  /**
   * `f`。
   */
  LowerF = 0x66, // "f"
  /**
   * `Z`。
   */
  UpperZ = 0x5a, // "Z"
  /**
   * `z`。
   */
  LowerZ = 0x7a, // "z"
  /**
   * `x`。
   */
  LowerX = 0x78, // "x"
  /**
   * `<` 在DSl模板中 小于号。
   */
  Lt = 0x3c, // "<"
  /**
   * `.` 在DSl模板中 点号。
   */
  Dot = 0x2e, // "."
  /**
   *`:` 在DSl模板中 冒号。
   */
  Colon = 0x3a, // ":"
  /**
   * `@` 符号在DSl模板中用作事件监听器的一部分，例如`@click="foo"`。
   */
  At = 0x40, // "@"
  /**
   * `[` 符号在DSl模板中用于动态属性绑定，例如`[foo]="bar"`。
   */
  LeftSquare = 91, // "["
  /**
   * `]` 符号在DSl模板中用于动态属性绑定，例如`[foo]="bar"`。
   */
  RightSquare = 93 // "]"
}

interface Callbacks {
  /**
   * 当解析到普通文本内容时被调用
   * @param start 开始位置索引
   * @param endIndex  结束位置索引
   */
  ontext(start: number, endIndex: number): void
  /**
   * 当解析到插值表达式（如Vue中的{{ expression }}）时被调用
   * @param start 开始位置索引
   * @param endIndex 结束位置索引
   */
  oninterpolation(start: number, endIndex: number): void
}

/**
 * 插值表达式开始标记 `{{`
 */
const defaultDelimitersOpen = new Uint8Array([123, 123]) // "{{"
/**
 * 插值表达式结束标记 `}}`
 */
const defaultDelimitersClose = new Uint8Array([125, 125]) // "}}"

/**
 * 用于判断一个字符是否为空白符。在DSl模板中，空白符包括空格、换行符、制表符等。
 * @param c 当前字符的代码点
 * @returns
 */
export function isWhitespace(c: number): boolean {
  return (
    c === CharCodes.Space ||
    c === CharCodes.NewLine ||
    c === CharCodes.FormFeed ||
    c === CharCodes.CarriageReturn
  )
}

/**
 * DSl模板只允许在标签名称的开头使用ASCII字母字符（a-z和a-z）。
 */
function isTagStartChar(c: number): boolean {
  return (
    (c >= CharCodes.LowerA && c <= CharCodes.LowerZ) ||
    (c >= CharCodes.UpperA && c <= CharCodes.UpperZ)
  )
}

/**
 * 用于判断一个字符是否表示标签（tag）部分的结束。如遇到`/` `>` `空格`。
 * @param c 当前字符的代码点
 * @returns 如果当前字符表示标签（tag）部分的结束，则返回 true；否则返回 false。
 */
function isEndOfTagSection(c: number): boolean {
  return c === CharCodes.Gt || isWhitespace(c)
}

export class Tokenizer {
  /** 标记器当前的状态 */
  public state = State.Text

  /**
   * 用于存储解析过程中遇到的字符
   */
  private buffer = ''
  /**
   * 标记器当前读取的字符索引
   */
  private index = 0

  /** 当前正在阅读的章节的开头。 */
  public sectionStart = 0

  /** 记录换行位置以进行快速行/列计算 */
  private newlines: number[] = []

  /**
   * 用于存储插值表达式的开始定界符。 `{{`
   */
  public delimiterOpen: Uint8Array = defaultDelimitersOpen
  /**
   * 用于存储插值表达式的结束定界符。 `}}`
   */
  public delimiterClose: Uint8Array = defaultDelimitersClose
  /**
   * 用于存储插值表达式结束定界符的索引。
   */
  private delimiterIndex = -1

  constructor(public cbs: Callbacks) {}

  public reset() {
    this.state = State.Text
    this.buffer = ''
    this.index = 0
    this.sectionStart = 0
    this.newlines = []
    this.delimiterIndex = -1
  }

  /**
   * 使用记录的换行符位置生成具有行/列信息的Position对象
   * 我们知道索引始终是一个已经处理过的索引，因此该索引之前的所有新行都应该被记录下来。
   */
  public getPos(index: number): Position {
    const line = 1
    const column = index + 1
    return {
      column,
      line,
      offset: index
    }
  }

  /**
   * 文本状态的处理函数
   */
  public stateText(c: number) {
    // console.log('stateText', c)
    if (c === this.delimiterOpen[0]) {
      // 如果遇到插值表达式的开始标记，则切换到插值表达式状态
      this.state = State.InterpolationOpen
      this.delimiterIndex = 0
      this.stateInterpolationOpen(c)
    }
  }

  /**
   * 处理插值表达式开始标记，例如{{
   */
  private stateInterpolationOpen(c: number): void {
    // console.log('1111', String.fromCharCode(c), this.sectionStart)
    if (c === this.delimiterOpen[this.delimiterIndex]) {
      if (this.delimiterIndex === this.delimiterOpen.length - 1) {
        // 如果已经匹配到插值表达式的结束标记，则切换到插值表达式处理状态
        const start = this.index + 1 - this.delimiterOpen.length
        if (start > this.sectionStart) {
          // 如果前面有普通文本，则先处理普通文本
          this.cbs.ontext(this.sectionStart, start)
        }
        this.state = State.Interpolation
        // 记录插值表达式开始位置，以便后续处理剩余的字符
        this.sectionStart = start
      } else {
        this.delimiterIndex++
      }
    } else {
      this.state = State.Text
      this.stateText(c)
    }
  }

  /**
   * 处理插值表达式内容状态，例如{{}}中的内容部分。
   */
  private stateInterpolation(c: number): void {
    if (c === this.delimiterClose[0]) {
      this.state = State.InterpolationClose
      this.delimiterIndex = 0
      this.stateInterpolationClose(c)
    }
  }

  /**
   * 处理插值表达式结束标记，例如}}
   */
  private stateInterpolationClose(c: number) {
    if (c === this.delimiterClose[this.delimiterIndex]) {
      if (this.delimiterIndex === this.delimiterClose.length - 1) {
        this.cbs.oninterpolation(this.sectionStart, this.index + 1)
        this.state = State.Text
        this.sectionStart = this.index + 1
      } else {
        this.delimiterIndex++
      }
    } else {
      this.state = State.Interpolation
      this.stateInterpolation(c)
    }
  }

  public parse(input: string) {
    this.buffer = input
    while (this.index < this.buffer.length) {
      const c = this.buffer.charCodeAt(this.index)
      if (c === CharCodes.NewLine) {
        // console.log('newline', '换行符')
        this.newlines.push(this.index)
      }

      switch (this.state) {
        case State.Text: {
          this.stateText(c)
          break
        }
        case State.InterpolationOpen: {
          // 插值表达式开始标记处理状态
          this.stateInterpolationOpen(c)
          break
        }
        case State.Interpolation: {
          // 插值表达式处理状态
          this.stateInterpolation(c)
          break
        }
        case State.InterpolationClose: {
          // 插值表达式结束标记处理状态
          this.stateInterpolationClose(c)
          break
        }

        default:
          break
      }
      this.index++
    }

    this.finish()
  }

  /**
   * 完成
   */
  private finish() {
    this.handleTrailingData()
    // this.cbs.onend()
  }

  private handleTrailingData() {
    const endIndex = this.buffer.length

    // 如果没有剩余数据，我们就完成了。
    if (this.sectionStart >= endIndex) {
      return
    }

    this.cbs.ontext(this.sectionStart, endIndex)
  }
}
