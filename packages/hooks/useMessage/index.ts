import { h } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useLocale } from '../useLocale'
import type { ElMessageBoxOptions } from 'element-plus/es/components/message-box/src/message-box.type'

interface BoxOptions extends ElMessageBoxOptions {
  /**
   * 副内容
   */
  subContent?: string
}

// 创建虚拟 DOM 节点 (vNode)，包括主内容和副内容
const mainTextStyle = { fontWeight: 700, fontSize: '15px' }
const subTextStyle = {
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: '16px',
  marginTop: '4px',
  color: '#999999',
}
const getCombContentVNode = (
  content: ElMessageBoxOptions['message'],
  subContent?: string
) => {
  if (typeof content === 'function' || !subContent) return content
  return h('div', { style: mainTextStyle }, [
    content,
    h('p', { style: subTextStyle }, subContent),
  ])
}

export const useMessage = () => {
  const { t } = useLocale()
  return {
    // 消息提示
    info(content: string) {
      ElMessage.info(content)
    },
    // 错误消息
    error(content: string) {
      ElMessage.error(content)
    },
    // 成功消息
    success(content: string) {
      ElMessage.success(content)
    },
    // 警告消息
    warning(content: string) {
      ElMessage.warning(content)
    },
    // 弹出提示
    alert(
      content: ElMessageBoxOptions['message'],
      title?: string,
      options?: BoxOptions
    ) {
      content = getCombContentVNode(content, options?.subContent)
      ElMessageBox.alert(content, title || t('common.confirmTitle'), {
        ...options,
      })
    },
    // 错误提示
    alertError(
      content: ElMessageBoxOptions['message'],
      title?: string,
      options?: BoxOptions
    ) {
      content = getCombContentVNode(content, options?.subContent)
      ElMessageBox.alert(content, title || t('common.confirmTitle'), {
        ...options,
        type: 'error',
      })
    },
    // 成功提示
    alertSuccess(
      content: ElMessageBoxOptions['message'],
      title?: string,
      options?: BoxOptions
    ) {
      content = getCombContentVNode(content, options?.subContent)
      ElMessageBox.alert(content, title || t('common.confirmTitle'), {
        ...options,
        type: 'success',
      })
    },
    // 警告提示
    alertWarning(
      content: ElMessageBoxOptions['message'],
      title?: string,
      options?: BoxOptions
    ) {
      content = getCombContentVNode(content, options?.subContent)
      ElMessageBox.alert(content, title || t('common.confirmTitle'), {
        ...options,
        type: 'warning',
      })
    },
    // 通知提示
    notify(content: string) {
      ElNotification.info(content)
    },
    // 错误通知
    notifyError(content: string) {
      ElNotification.error(content)
    },
    // 成功通知
    notifySuccess(content: string) {
      ElNotification.success(content)
    },
    // 警告通知
    notifyWarning(content: string) {
      ElNotification.warning(content)
    },
    // 确认窗体
    confirm(
      content: ElMessageBoxOptions['message'],
      title?: string,
      options?: BoxOptions
    ) {
      content = getCombContentVNode(content, options?.subContent)
      return ElMessageBox.confirm(
        content,
        title ? title : t('common.confirmTitle'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          ...options,
          type: 'warning',
        }
      )
    },
    // 删除窗体
    delConfirm(
      content?: ElMessageBoxOptions['message'],
      title?: string,
      options?: BoxOptions
    ) {
      content = getCombContentVNode(content, options?.subContent)
      return ElMessageBox.confirm(
        content ? content : t('common.delMessage'),
        title ? title : t('common.confirmTitle'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          ...options,
          type: 'error',
        }
      )
    },
    // 导出窗体
    exportConfirm(content?: ElMessageBoxOptions['message'], tip?: string) {
      return ElMessageBox.confirm(
        content ? content : t('common.exportMessage'),
        tip ? tip : t('common.confirmTitle'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
        }
      )
    },
    // 提交内容
    prompt(content: ElMessageBoxOptions['message'], tip: string) {
      return ElMessageBox.prompt(content, tip, {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      })
    },
  }
}
