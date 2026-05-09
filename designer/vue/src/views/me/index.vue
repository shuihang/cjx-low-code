<template>
  <div class="me">
    <h1>个人中心</h1>
    <p>个人中心功能待开发</p>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// Me page
</script>

<style scoped>
.me {
  text-align: center;
  padding: 2rem;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #67c23a;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #85ce61;
}
</style>
