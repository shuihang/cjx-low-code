import { useMessage } from '@cjx-low-code/hooks/useMessage'

const message = useMessage()

// 定义一个常量来存储小数据的大小限制
const SMALL_DATA_SIZE_LIMIT = 150
const checkResponseValid = (responseBlob: Blob) => {
  return new Promise<void>(async (resolve) => {
    // 仅处理小数据，大数据默认为文件数据
    if (responseBlob.size < SMALL_DATA_SIZE_LIMIT) {
      try {
        const resp = JSON.parse(await responseBlob.text())
        if (resp?.code !== 200 && resp?.msg) {
          message.error(resp.msg)
        }
      } catch (err: any) {
        // 处理 JSON 解析失败的情况
        if (err instanceof SyntaxError) {
          // 说明返回的是数据流
          resolve()
        } else {
          // 其他类型的错误
          console.error('An unexpected error occurred:', err)
          message.error(err.message)
        }
      }
    } else {
      resolve()
    }
  })
}

const download1 = (data: Blob, fileName: string, mineType: string) => {
  // 创建 blob
  const blob = new Blob([data], { type: mineType })
  // 创建 href 超链接，点击进行下载
  window.URL = window.URL || window.webkitURL
  const href = URL.createObjectURL(blob)
  const downA = document.createElement('a')
  downA.href = href
  downA.download = fileName
  downA.click()
  // 销毁超连接
  window.URL.revokeObjectURL(href)
}

const download0 = (data: Blob, fileName: string, mineType: string) => {
  checkResponseValid(data).then(() => {
    download1(data, fileName, mineType)
  })
}

const download = {
  // 下载 Excel 方法
  excel: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/vnd.ms-excel')
  },
  // 下载 Word 方法
  word: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/msword')
  },
  // 下载 Zip 方法
  zip: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/zip')
  },
  // 下载 Html 方法
  html: (data: Blob, fileName: string) => {
    download0(data, fileName, 'text/html')
  },
  // 下载 Markdown 方法
  markdown: (data: Blob, fileName: string) => {
    download0(data, fileName, 'text/markdown')
  },
  pdf: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/pdf')
  },
}

export default download
