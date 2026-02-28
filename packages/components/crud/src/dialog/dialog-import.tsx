import { ref } from 'vue'
import { ElButton, ElIcon, ElUpload } from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import ZtDialog from '../../../dialog/src/index'
import download from '../../../_util/download'
import { DownloadOutlined } from '../../../crud/src/icon'
import { useLocale } from '@cjx-low-code/hooks'
import { useMessage } from '@cjx-low-code/hooks/useMessage'
import type { ImportProps } from '../interface'
import type { DialogProps } from '../../../dialog/src/index'

const XDialogImport = (props: ImportProps, slots?: () => Promise<any>) => {
  const { t } = useLocale() // 国际化

  const {
    importApi,
    downloadApi,
    importParams = {},
    onSuccess,
    ...othersProps
  } = props
  const message = useMessage() // 消息弹窗

  const downTemplate = async () => {
    const data = await downloadApi({ fileName: props?.fileName })
    const reader = new FileReader()
    reader.readAsText(data, 'utf-8')
    reader.onload = function (e) {
      // console.log(e, 'e')
      // console.log(reader.result, 'result')
      // const obj = JSON.parse(reader.result)
      download.excel(data, `${props?.downName}.xlsx`)
      // if (obj.msg || obj.data === null) {
      //   message.warning(obj.msg)
      // }else {
      //   download.excel(data,  `${props?.downName}.xls`);
      // }
    }
    //console.log(data, '3333')
    //
  }
  const onSave = (done: () => void) => {
    if (fileList.value.length === 0) {
      message.warning('请上传文件')
      done()
      return
    }
    // console.log(fileList.value, 'fileList')
    fileList.value.forEach(async (item) => {
      await importApi({ file: item.raw, ...importParams })
        .then(() => {
          fileList.value = []
          onSuccess!()
          message.success(t('common.ImportSuccess'))
          done()
        })
        .catch(() => {
          fileList.value = []
          done()
        })
    })
  }

  const option = ref<DialogProps>({
    ...othersProps,
    width: 600,
    visible: true,
    showSaveBtn: true,
    onClose: () => {
      fileList.value = []
    },
    onSave,
  })

  const fileList = ref<UploadFiles>([])

  const onChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    // const formData = new FormData()
    // formData.append('file', uploadFile.file)
    // console.log(uploadFile, uploadFile!.name.split('.'))
    if (!['xls', 'xlsx'].includes(uploadFile!.name.split('.')[1])) {
      message.warning('请上传.xls/.xlsx文件')
      fileList.value = []
    } else {
      fileList.value = uploadFiles
    }
  }

  const onRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    fileList.value = uploadFiles
  }

  // const toUploadImg = async (param: UploadRequestOptions) => {
  //   const formData = new FormData()
  //   formData.append('file', param.file)
  //   console.log(param.file, formData)
  //   await importApi({file: param.file})
  // }

  return (
    <ZtDialog option={option.value}>
      <div class={'flex justify-between items-center m-b-8px'}>
        <div>{slots && slots!()}</div>
        <div>
          <ElIcon size={14} color={'#666666'} class={'m-b-2px'}>
            <DownloadOutlined />
          </ElIcon>
          <ElButton
            type="primary"
            style={{ color: '#666666' }}
            link
            onClick={downTemplate}
          >
            {t('table.downloadTemplate')}
          </ElButton>
        </div>
      </div>
      <ElUpload
        drag
        auto-upload={false}
        onChange={onChange}
        on-remove={onRemove}
        v-model:fileList={fileList.value}
        // http-request={toUploadImg}
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          {t('table.dragTheFileHere')}
          <ElButton type="primary" link>
            {t('table.clickToUpload')}
          </ElButton>
          <p class={'font-size-12px'}>
            {t('table.onlyImport')}
            <span class={'color-[var(--el-color-primary)]'}> .xls</span>/
            <span class={'color-[var(--el-color-primary)]'}>.xlsx </span>
            {t('table.onlyImportFooter')}
          </p>
        </div>
      </ElUpload>
    </ZtDialog>
  )
}

export default XDialogImport
