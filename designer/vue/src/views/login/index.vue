<template>
  <div class="login-container">
    <x-particles :slot-style="{ height: '100%' }">
      <div class="flex items-center justify-center h-100%">
        <div class="aside">
          <div class="flex flex-col items-center justify-center h-100%">
            <logo />
            <h2>这是我用过最好的低代码</h2>
          </div>
        </div>

        <div class="login_area">
          <userLogin />
        </div>
      </div>
    </x-particles>
  </div>
</template>

<script setup lang="ts">
import logo from '@/components/common/logo.vue'
import userLogin from '@/layout/userLogin/index.vue'
import XParticles from '@/components/particlesJS/index.vue'
</script>

<style lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background-color: #000;
  // .ant-row {
  //   width: 600px;
  //   height: 400px;
  // }
  .aside {
    width: 350px;
    height: 450px;
    background: url(../../assets/image/login.png) no-repeat;
    background-size: 100% 100%;
    color: #fff;
    padding: 27px;
    box-sizing: border-box;
    border-radius: 20px 0 0 20px;
    line-height: 1.5;
    font-size: 18px;
    text-align: center;
    h2 {
      margin-top: 25px;
    }
  }

  .login_area {
    width: 380px;
    height: 450px;
    background: #fff;
    // background: linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255, 0.7) 100%);
    border-radius: 0 20px 20px 0;
  }
}
</style>
