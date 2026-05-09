<template>
  <div class="particles-container">
    <div class="flex align-center justify-center" :style="slotStyle">
      <div class="particles-content" :style="{ zIndex: props.zIndex }">
        <slot />
      </div>
    </div>

    <vue-particles
      id="tsparticles"
      ref="particlesContainer"
      class="particles"
      :particles-init="particlesInit"
      :particles-loaded="particlesLoaded"
      :options="particlesOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { loadSlim } from '@tsparticles/slim'
import particlesJson from './particles.json'
import type { Engine } from '@tsparticles/engine'

// 首先需要引入一下我们刚刚创建的store
import useTheme from '@/store/modules/theme'
// 因为是个方法，所以我们得调用一下
const themeStore = useTheme()

const props = defineProps({
  zIndex: String,
  color: null,
  slotStyle: Object
})

const particlesInit = async (engine: Engine) => {
  await loadSlim(engine)
}

const particlesLoaded = async (container: any) => {
  console.log('Particles container loaded', container)
}

const particlesOptions = computed(() => {
  const color = props.color || themeStore.themeColor

  // Convert particles.js config to tsparticles format
  return {
    particles: {
      number: {
        value: 160, // 密集一倍：从120增加到240
        density: {
          enable: true,
          value_area: 600 // 密集一倍：从600减小到300
        }
      },
      color: {
        value: color
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        }
      },
      opacity: {
        value: 0.3, // 保持透明度
        random: true,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3, // 大一半：从2增加到3
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 1, // 大一半：从0.5增加到1
          sync: false
        }
      },
      links: {
        enable: true,
        distance: 140, // 增加连线距离，让连接线更长
        color,
        opacity: 0.4, // 保持连线透明度
        width: 2 // 保持连线宽度
      },
      move: {
        enable: true,
        speed: 4, // 增加移动速度，让动画更活跃
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out'
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab' // 悬停模式：抓取（吸引粒子）
        },
        onClick: {
          enable: true,
          mode: 'repulse' // 点击模式：排斥粒子
        }
      },
      modes: {
        grab: {
          distance: 140, // 吸引作用距离
          links: { opacity: 1 } // 抓取时连线完全不透明，非常明显
        },
        repulse: {
          distance: 100, // 排斥作用距离
          duration: 0.4 // 排斥效果持续时间
        }
      }
    },
    retina_detect: true
  }
})

watch(
  () => themeStore.themeColor,
  (newVal, oldVal) => {
    console.log('Theme color changed:', newVal, oldVal)
  }
)
</script>

<style lang="scss" scoped>
.particles-container {
  width: 100%;
  height: 100%;
  position: relative;
  .particles-content {
    position: relative;
  }
  .particles {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
