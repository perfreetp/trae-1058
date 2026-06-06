<template>
  <div>
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-label">今日巡护次数</div>
        <div class="stat-card-value">{{ store.patrolRecords.filter(p => p.startTime.startsWith(store.currentDate)).length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">活跃火情</div>
        <div class="stat-card-value danger">{{ activeFireCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">备勤队伍</div>
        <div class="stat-card-value success">{{ standbyTeamCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">今日火险等级</div>
        <div class="stat-card-value" :class="todayRiskClass">{{ todayRiskText }}</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗺️ 区域态势地图</div>
        </div>
        <div class="map-container">
          <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; padding: 10px;">
              <div
                v-for="cell in store.gridCells"
                :key="cell.id"
                :class="['grid-cell', `fire-risk-${cell.fireRiskLevel}`]"
                :title="`${cell.name} - ${cell.vegetation} - 责任人: ${cell.responsiblePerson}`"
                style="width: 50px; height: 50px; font-size: 10px;"
              >
                <span class="grid-cell-name">{{ cell.name }}</span>
              </div>
            </div>
            <div v-for="tower in store.watchTowers" :key="tower.id" style="position: absolute; left: 20%; top: 30%;">
              <div style="background: #1890ff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                🗼 {{ tower.name }}
              </div>
            </div>
            <div v-for="fire in store.firePoints.filter(f => f.status !== 'extinguished')" :key="fire.id" style="position: absolute; right: 30%; top: 40%;">
              <div style="background: #f5222d; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; animation: pulse 2s infinite;">
                🔥 {{ fire.location }}
              </div>
            </div>
          </div>
        </div>
        <div class="fire-legend mt-16">
          <div class="legend-item"><span class="legend-color fire-risk-1"></span>低火险</div>
          <div class="legend-item"><span class="legend-color fire-risk-2"></span>较低火险</div>
          <div class="legend-item"><span class="legend-color fire-risk-3"></span>中火险</div>
          <div class="legend-item"><span class="legend-color fire-risk-4"></span>高火险</div>
          <div class="legend-item"><span class="legend-color fire-risk-5"></span>极高火险</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🌤️ 气象趋势</div>
        </div>
        <div ref="weatherChartRef" class="chart-container"></div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📋 实时动态</div>
          <button class="btn btn-primary btn-sm" @click="showCallModal = true">📞 登记通话</button>
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
          <div v-for="call in store.callRecords.slice().reverse()" :key="call.id" style="padding: 12px; border-bottom: 1px solid #f0f0f0;">
            <div class="flex-between mb-8">
              <strong>{{ call.caller }}</strong>
              <span style="color: #999; font-size: 12px;">{{ call.time }}</span>
            </div>
            <div style="color: #666;">{{ call.content }}</div>
            <div style="color: #999; font-size: 12px; margin-top: 4px;">处理人：{{ call.handler }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🚶 今日巡护</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>巡护组</th>
              <th>路线</th>
              <th>状态</th>
              <th>里程</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patrol in store.patrolRecords" :key="patrol.id">
              <td>{{ patrol.patrolName }}</td>
              <td>{{ patrol.route }}</td>
              <td>
                <span class="badge" :class="getPatrolBadgeClass(patrol.status)">
                  {{ getPatrolStatusText(patrol.status) }}
                </span>
              </td>
              <td>{{ patrol.distance }} km</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showCallModal" class="modal-overlay" @click.self="showCallModal = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">📞 登记通话纪要</div>
          <button class="modal-close" @click="showCallModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label class="form-label">来电方</label>
            <input class="form-input" v-model="newCall.caller" placeholder="请输入来电方名称" />
          </div>
          <div class="form-item">
            <label class="form-label">联系电话</label>
            <input class="form-input" v-model="newCall.callerPhone" placeholder="请输入联系电话" />
          </div>
          <div class="form-item">
            <label class="form-label">通话内容</label>
            <textarea class="form-textarea" v-model="newCall.content" placeholder="请输入通话内容"></textarea>
          </div>
          <div class="form-item">
            <label class="form-label">处理人</label>
            <input class="form-input" v-model="newCall.handler" placeholder="请输入处理人" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showCallModal = false">取消</button>
          <button class="btn btn-primary" @click="saveCallRecord">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useMainStore } from '@/store'
import type { CallRecord } from '@/types'

const store = useMainStore()
const weatherChartRef = ref<HTMLElement>()
const showCallModal = ref(false)

const newCall = ref<Partial<CallRecord>>({
  caller: '',
  callerPhone: '',
  content: '',
  handler: ''
})

const activeFireCount = computed(() => {
  return store.firePoints.filter(f => ['reported', 'verified', 'disposing'].includes(f.status)).length
})

const standbyTeamCount = computed(() => {
  return store.fireTeams.filter(t => t.status === 'standby').length
})

const todayRiskLevel = computed(() => {
  const levels = store.gridCells.map(g => g.fireRiskLevel)
  return Math.max(...levels)
})

const todayRiskText = computed(() => {
  const texts = ['', '一级', '二级', '三级', '四级', '五级']
  return texts[todayRiskLevel.value]
})

const todayRiskClass = computed(() => {
  const classes = ['', 'success', 'success', 'warning', 'danger', 'danger']
  return classes[todayRiskLevel.value]
})

function getPatrolStatusText(status: string) {
  const map: Record<string, string> = {
    patrolling: '巡护中',
    completed: '已完成',
    pending: '待出发'
  }
  return map[status] || status
}

function getPatrolBadgeClass(status: string) {
  const map: Record<string, string> = {
    patrolling: 'badge-warning',
    completed: 'badge-success',
    pending: 'badge-info'
  }
  return map[status] || 'badge-info'
}

function saveCallRecord() {
  if (!newCall.value.caller || !newCall.value.content) return
  
  const record: CallRecord = {
    id: Date.now().toString(),
    time: new Date().toLocaleString('zh-CN'),
    caller: newCall.value.caller,
    callerPhone: newCall.value.callerPhone || '',
    content: newCall.value.content,
    handler: newCall.value.handler || '值班员'
  }
  store.callRecords.unshift(record)
  store.saveToLocalStorage()
  
  showCallModal.value = false
  newCall.value = { caller: '', callerPhone: '', content: '', handler: '' }
}

function initWeatherChart() {
  if (!weatherChartRef.value) return
  
  const chart = echarts.init(weatherChartRef.value)
  const data = store.weatherData.slice(-14)
  
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['温度', '湿度', '火险等级'],
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date.slice(5)),
      axisLabel: { fontSize: 11 }
    },
    yAxis: [
      {
        type: 'value',
        name: '温度/湿度',
        position: 'left'
      },
      {
        type: 'value',
        name: '火险等级',
        position: 'right',
        max: 5,
        min: 0
      }
    ],
    series: [
      {
        name: '温度',
        type: 'line',
        data: data.map(d => d.temperature),
        smooth: true,
        itemStyle: { color: '#f5222d' }
      },
      {
        name: '湿度',
        type: 'line',
        data: data.map(d => d.humidity),
        smooth: true,
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '火险等级',
        type: 'bar',
        yAxisIndex: 1,
        data: data.map(d => d.fireRiskLevel),
        itemStyle: { 
          color: (params: any) => {
            const colors = ['#52c41a', '#52c41a', '#faad14', '#f5222d', '#a8071a']
            return colors[params.value - 1]
          }
        }
      }
    ]
  })
}

onMounted(() => {
  nextTick(() => {
    initWeatherChart()
  })
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
