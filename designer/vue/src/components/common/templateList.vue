<template>
  <a-row :gutter="16">
    <b-flex wrap="wrap">
      <a-col v-for="item of props.data" :key="item" class="poster-item" span="6">
        <a-card hoverable>
          <template #cover>
            <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
            <div class="hover-mask">
              <a-button type="primary">使用该模版创建</a-button>
            </div>
          </template>
          <a-card-meta :title="`测试 ${item}`">
            <template #description>
              <div class="description-detail">
                <b-flex justify="space-between">
                  <span>作者： 测试952{{ item }}</span>
                  <span>6666</span>
                </b-flex>
              </div>
            </template>
          </a-card-meta>
        </a-card>

        <div v-if="item === 1 || item === 2" class="tag-list">
          <slot name="tag" />
        </div>
      </a-col>
    </b-flex>
  </a-row>
</template>

<script setup lang="ts">
// import { TemplateProps } from '../../stores/module/template'
const props = defineProps({
  data: Number
})
</script>

<style lang="scss">
@import '../../theme/styles/mixin.scss';

.poster-item {
  padding-bottom: 20px;
  position: relative;
  z-index: 2;
  .ant-card-cover {
    overflow: hidden;
    position: relative;
    border-radius: 20px 20px 0 0;
    &:hover img {
      scale: 1.3;
    }
    &:hover .hover-mask {
      display: flex;
    }
    img {
      transition: all 0.2s ease-in;
    }
    .hover-mask {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      border-radius: 20px 20px 0 0;
      position: absolute;
      left: 0;
      top: 0;

      align-items: center;
      justify-content: center;
    }
  }

  .tag-list {
    position: absolute;
    top: -4px;
    left: 6px;
  }

  .ant-card-body {
    padding: 0;
    .ant-card-meta-title {
      @include color;
      padding: 10px 12px;
      border-bottom: 1px solid #f2f2f2;
      margin-bottom: 0 !important;
      text-align: left;
    }
    .description-detail {
      padding: 13px 12px;
      color: #999;
    }
  }
}
</style>
../../stores/module/template
