<template>
  <div class="home">
    <h1>欢迎使用 cjx-low-code-web</h1>
    <p>这是一个低代码平台的前端展示项目</p>

    <div class="nav-links">
      <router-link to="/form-design" class="nav-link">表单设计</router-link>
      <router-link to="/login" class="nav-link">登录</router-link>
      <router-link to="/me" class="nav-link">个人中心</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.nav-links {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  background-color: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #66b1ff;
}
</style>
