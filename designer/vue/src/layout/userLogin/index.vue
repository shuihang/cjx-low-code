<template>
  <div class="user-login">
    <div class="flex items-center justify-center" :style="{ height: '100%' }">
      <el-form
        ref="formRef"
        :model="formState"
        name="normal_login"
        class="login-form"
        @finish-failed="onFinishFailed"
      >
        <el-form-item
          prop="phone"
          :rules="[
            { required: true, message: '手机号码不能为空' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="formState.phone"
            class="border-round"
            size="large"
            placeholder="手机号码"
            width="300"
          >
            <template #suffix>
              <el-icon><Iphone /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="code" :rules="[{ required: true, message: '验证码不能为空' }]">
          <el-input v-model="formState.code" size="large" round placeholder="验证码">
            <template #suffix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            html-type="submit"
            round
            class="login-form-button"
            @click="onFinish"
          >
            登陆
          </el-button>

          <el-button
            :disabled="disabled"
            type="primary"
            html-type="submit"
            round
            style="margin-left: 15px"
          >
            获取验证码
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Iphone, Lock } from '@element-plus/icons-vue'
// import { message } from 'ant-design-vue'
import { ElForm, ElLoading } from 'element-plus'
import useUserStore from '@/store/modules/user'

const message = useMessage()

const userStore = useUserStore()

const router = useRouter()

interface FormState {
  phone: string
  code: string
}
const formState = reactive<FormState>({
  phone: '',
  code: ''
})

const formRef = useCompRef(ElForm)

const loading = ref()
const content = ref('登陆中...')
const onFinish = async () => {
  await formRef.value?.validate()
  loading.value = ElLoading.service({
    lock: true,
    text: content.value,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  // message.loading({ content: () => content.value });
  // console.log('Success:', values, formState.phone.slice(7, 11));
  userStore.login({ userName: `测试${formState.phone.slice(7, 11)}` })

  setTimeout(() => {
    loading.value.close()
    content.value = '登陆成功！'
    router.push({
      path: '/'
    })
  }, 1000)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const disabled = computed(() => {
  return !/^1[3456789]\d{9}$/.test(formState.phone)
})
</script>

<style lang="scss" scoped>
.user-login {
  position: sticky;
  z-index: 9;
  height: 100%;
  ::v-deep(.el-input__wrapper) {
    border-radius: 555px;
  }
}
</style>
