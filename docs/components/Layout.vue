<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import LocaleProvider from './LocaleProvider.vue'
</script>

<template>
  <LocaleProvider>
    <DefaultTheme.Layout />
  </LocaleProvider>
</template>