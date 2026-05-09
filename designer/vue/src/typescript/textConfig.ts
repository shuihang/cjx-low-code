import { h } from 'vue'
/**
 * 字体
 */
export const fontFamily = [
  { label: '宋体', value: 'SimSun, STSong' },
  { label: '黑体', value: 'SimHei, STHeiti' },
  { label: '楷体', value: 'KaiTi, STKaiti' },
  { label: '仿宋', value: 'FangSong, STFangsong' },
  { label: '微软雅黑', value: 'Microsoft YaHei, STYhei' },
  { label: '华文细黑', value: 'STXihei, STXihei' },
  { label: '新细明体', value: 'PMingLiU, serif' },

  { label: 'Arial style', value: 'Arial, sans-serif' },
  { label: 'Arial Black', value: 'Arial Black, Gadget, sans-serif' },
  { label: 'Arial Narrow', value: 'Arial Narrow, Arial, sans-serif' },
  { label: 'Arial Rounded MT Bold', value: 'Arial Rounded MT Bold, Arial, sans-serif' },
  { label: 'Book Antiqua', value: 'Book Antiqua, Palatino, serif' },
  { label: 'Comic Sans', value: 'Comic Sans MS' },
  { label: 'Courier New', value: 'Courier New, Courier, monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Impact', value: 'Impact, chicago' },
  { label: 'Lucida Console', value: 'Lucida Console, Monaco, monospace' },
  { label: 'Lucida Sans Unicode', value: 'Lucida Sans Unicode, Lucida Grande, sans-serif' },
  { label: 'Palatino Linotype', value: 'Palatino Linotype, Book Antiqua, Palatino, serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva,sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, Times, serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, Helvetica, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' }
]

export const fontFamilyOption = fontFamily.map((item) => {
  return {
    value: item.value,
    label: h('span', { style: { fontFamily: item.value } }, item.label)
  }
})
