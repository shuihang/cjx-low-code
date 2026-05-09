export interface ButtonOpt {
  component: string
  text: string
  path: string
  span: number
  onClick?: (v: any) => any
}

export interface ButtonComponent {
  buttonAuth: string
  buttonOpt: ButtonOpt[]
}

export const buttonComponent: ButtonComponent[] = [
  {
    buttonAuth: 'editor',
    buttonOpt: [
      {
        component: 'el-button',
        text: '预览表单',
        path: '/editor',
        span: 10
      },
      {
        component: 'el-button',
        text: '保存',
        path: '/editor',
        span: 7
      },
      {
        component: 'el-button',
        text: '发布',
        path: '/editor',
        span: 7
      }
    ]
  },
  {
    buttonAuth: 'default',
    buttonOpt: [
      {
        component: 'el-button',
        text: '创建表单',
        path: '/form-design',
        span: 12
      },
      {
        component: 'el-button',
        text: '我的表单',
        path: '/myWork',
        span: 12
      }
    ]
  }
]
