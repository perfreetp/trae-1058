<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-logo">
        🌲 林业防火系统
      </div>
      <nav class="sidebar-menu">
        <div
          v-for="route in menuRoutes"
          :key="route.path"
          class="menu-item"
          :class="{ active: $route.path === route.path }"
          @click="$router.push(route.path)"
        >
          <span class="menu-icon">{{ route.meta?.icon }}</span>
          <span>{{ route.meta?.title }}</span>
        </div>
      </nav>
    </aside>
    <div class="main-container">
      <header class="header">
        <div class="header-left">
          <span class="header-title">{{ $route.meta?.title }}</span>
        </div>
        <div class="header-right">
          <div class="status-badge" :class="systemStatus.class">
            <span>●</span>
            <span>{{ systemStatus.text }}</span>
          </div>
          <div class="status-badge normal">
            <span>🕐</span>
            <span>{{ currentTime }}</span>
          </div>
          <div class="status-badge warning">
            <span>👤</span>
            <span>值班员：李主任</span>
          </div>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '@/store'

const router = useRouter()
const route = useRoute()
const store = useMainStore()

const currentTime = ref('')

const menuRoutes = computed(() => {
  return router.options.routes.filter(r => r.meta?.title)
})

const systemStatus = computed(() => {
  const activeFires = store.firePoints.filter(f => ['reported', 'verified', 'disposing'].includes(f.status)).length
  if (activeFires > 0) {
    return { class: 'danger', text: `有 ${activeFires} 起火情处置中` }
  }
  const highRisk = store.gridCells.filter(g => g.fireRiskLevel >= 4).length
  if (highRisk > 5) {
    return { class: 'warning', text: '高火险预警' }
  }
  return { class: 'normal', text: '系统运行正常' }
})

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  if (!store.loadFromLocalStorage()) {
    store.initMockData()
  }
  updateTime()
  setInterval(updateTime, 1000)
})
</script>
