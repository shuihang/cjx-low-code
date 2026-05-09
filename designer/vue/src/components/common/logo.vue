<template>
  <div class="logo flex items-center" @click="jumpPage('/')">
    <img class="m-r-14px" src="@/assets/image/logo.png" alt="" srcset="" />
    cjx-low-code
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// pinia 主题
import useTheme from '@/store/modules/theme'
// import logImg from '@/theme/image/'

const themeStore = useTheme()

const router = useRouter()

const logImg = computed(() => {
  console.log(`../../theme/image/headLogo_${themeStore.themeColor.split('#')[0]}.png`)
  return `../../theme/image/headLogo_00b96b.png`
})

const jumpPage = (url: string) => {
  router.push({
    path: url
  })
}
</script>

<style lang="scss" scoped>
.logo {
  cursor: pointer;
  z-index: 9;
  img {
    height: 35px;
  }
}
</style>
