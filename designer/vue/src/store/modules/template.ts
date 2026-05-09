import { defineStore } from 'pinia'
import type { FormColumnProps } from 'cjx-low-code'
import type { FormComponentProps } from '@/defaultFormTemplates'

export interface TemplateProps {
  id: number
  title: string
  coverImg: string
  author: string
  copiedCount: number
  formColumns: FormColumnProps[]
}

export type TemplateDataProps = {
  templateData: TemplateProps[]
}

const useTemplateStore = defineStore('Template', {
  state: (): TemplateDataProps => ({
    templateData: [
      {
        id: 1,
        title: '1',
        coverImg: '11',
        author: 'test',
        copiedCount: 1,
        formColumns: []
      }
    ]
  }),
  actions: {}
})

export default useTemplateStore
