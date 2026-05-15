import type { FunctionalComponent } from 'vue'

/**
 * @param _
 * @param attrs
 * @returns
 */

/**
 * 单行文本框图标
 */
export const SingleLineTextBox: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <path
          d="M13.5 3A1.5 1.5 0 0 1 15 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 11.5v-7A1.5 1.5 0 0 1 2.5 3Zm0 1h-11a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5Z"
          fillRule="nonzero"
        />
      </svg>
    </i>
  )
}

/**
 * 多行文本框图标
 */
export const MultiLineTextBox: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <path
          fill="currentColor"
          d="M15 9v2.5a1.5 1.5 0 0 1-1.356 1.493L13.5 13H11v-1h2.5a.5.5 0 0 0 .492-.41L14 11.5V9h1Z"
          fillRule="nonzero"
        />
        <path
          fill="currentColor"
          d="M13.5 3h-11A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h8.707L15 9.207V4.5A1.5 1.5 0 0 0 13.5 3Zm.09 1.008A.5.5 0 0 1 14 4.5v4.292L10.792 12H2.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h11l.09.008Z"
          fillRule="nonzero"
        />
        <path fill="currentColor" d="M5 6 5 9 4 9 4 6z" fillRule="nonzero" />
      </svg>
    </i>
  )
}

/**
 * 下拉框图标
 */
export const DropdownBox: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <g>
          <path
            fill="currentColor"
            d="M13.5 3h-11A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3Zm-11 1h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5Z"
            fillRule="nonzero"
          />
          <path
            fill="currentColor"
            d="m12.146 7.146.708.708L11.207 9.5a1 1 0 0 1-1.32.083L9.793 9.5 8.146 7.854l.708-.708L10.5 8.793l1.646-1.647Z"
            fillRule="nonzero"
          />
        </g>
      </svg>
    </i>
  )
}

/**
 * 下拉多选框图标
 */
export const DropdownMultiBox: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <g>
          <path
            fill="currentColor"
            d="M13.5 3h-11A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3Zm-11 1h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5Z"
            fillRule="nonzero"
          />
          <path
            fill="currentColor"
            d="m12.146 7.146.708.708L11.207 9.5a1 1 0 0 1-1.32.083L9.793 9.5 8.146 7.854l.708-.708L10.5 8.793l1.646-1.647Z"
            fillRule="nonzero"
          />
          <path fill="currentColor" d="M6 3.5 6 12.5 5 12.5 5 3.5z" fillRule="nonzero" />
          <path fill="currentColor" d="M5 7.5 5 8.5 1.5 8.5 1.5 7.5z" fillRule="nonzero" />
        </g>
      </svg>
    </i>
  )
}

/**
 * 单选框图标
 */
export const RadioButton: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <g>
          <path
            fill="currentColor"
            d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 1a6 6 0 1 0 0 12A6 6 0 0 0 8 2Z"
            fillRule="nonzero"
          />
          <path fill="currentColor" d="M8 5a3 3 0 1 0 .042 0H8Z" fillRule="nonzero" />
        </g>
      </svg>
    </i>
  )
}

/**
 * 多选框图标
 */
export const CheckBox: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <g fillRule="evenodd" strokeWidth="1">
          <path
            fill="currentColor"
            d="m11.146 6.146.708.708L7.707 11a1 1 0 0 1-1.32.083L6.293 11 4.146 8.854l.708-.708L7 10.293l4.146-4.147Z"
            fillRule="nonzero"
          />
          <path
            fill="currentColor"
            d="M13.5 1h-11A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 13.5 1Zm-11 1h11a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5Z"
            fillRule="nonzero"
          />
        </g>
      </svg>
    </i>
  )
}

/**
 * 开关图标
 */
export const Switch: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <g fillRule="evenodd" strokeWidth="1">
          <path
            fill="currentColor"
            d="M10 3a5 5 0 0 1 0 10H6A5 5 0 0 1 6 3Zm0 1H6a4 4 0 1 0 0 8h4a4 4 0 1 0 0-8Z"
            fillRule="nonzero"
          />
          <path fill="currentColor" d="M5.5 6a2 2 0 1 0 .025 0H5.5Z" fillRule="nonzero" />
        </g>
      </svg>
    </i>
  )
}

/**
 * 评分图标
 */
export const RateIcon: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <path
          fill="currentColor"
          d="M13.5 3h-11A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3Zm-11 1h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5Z"
        />
      </svg>
    </i>
  )
}

/**
 * 滑块图标
 */
export const SliderIcon: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <path
          fill="currentColor"
          d="M13.5 3h-11A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3Zm-11 1h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5Z"
        />
      </svg>
    </i>
  )
}

/**
 * 时间选择器图标
 */
export const TimePickerIcon: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <path
          fill="currentColor"
          d="M13.5 3h-11A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3Zm-11 1h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5Z"
        />
      </svg>
    </i>
  )
}

/**
 * 时间选择图标
 */
export const TimeSelectIcon: FunctionalComponent = () => {
  return (
    <i class="el-icon">
      <svg viewBox="0 0 16 16" width="1em" height="1em">
        <path
          fill="currentColor"
          d="M13.5 3h-11A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3Zm-11 1h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5Z"
        />
      </svg>
    </i>
  )
}
