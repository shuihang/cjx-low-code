import zh from './lang/zh'
import en from './lang/en'

type Languages = 'zh-cn' | 'en';

const attributePathfn = (lang: Languages = 'zh-cn') => {
  return [
    { text: 'Crud', link: '/attribute/crud.md' },
    { text: 'Form', link: '/attribute/form.md' },
    { text: 'EditTable', link: '/attribute/editTable.md' },
    { text: '$XDialog', link: '/attribute/dialog.md' },
  ].map(item => {
    return {
      ...item,
      link: `/${lang}${item.link}`
    }
  })
}

const componentPathfn = (lang: Languages = 'zh-cn') => {
  return [
    { text: 'Crud', link: '/components/crud.md' },
    { text: 'Form', link: '/components/form.md' },
    { text: 'EditTable', link: '/components/editTable.md' },
    { text: '$XDialog', link: '/components/dialog.md' },
  ].map(item => {
    return {
      ...item,
      link: `/${lang}${item.link}`
    }
  })
}

export const getSidebar = (lang: Languages = 'zh-cn') => {
  const language = lang === 'zh-cn' ? zh : en
  const attributeOrComponetsArray = [
    `/${lang}/attribute/`,
    `/${lang}/components/`
  ]
  const sidebar = {}
  attributeOrComponetsArray.forEach(key => {
    sidebar[key] = [
      {
        text: language.sidebar.propertyConfiguration,
        collapsed: true,
        items: attributePathfn(lang)
      },
      {
        text: language.sidebar.component,
        collapsed: true,
        items: componentPathfn(lang)
      },
    ]
  })

  return sidebar
}