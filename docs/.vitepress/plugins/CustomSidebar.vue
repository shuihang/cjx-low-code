<template>
  <aside>
    <ul>
      <li v-for="item in sidebarItems" :key="item.text">
        <a :href="item.link">{{ item.text }}</a>
        <ul v-if="item.children">
          <li v-for="child in item.children" :key="child.text">
            <a :href="child.link">{{ child.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  props: {
    sidebarItems: Array,
  },
};
</script>
