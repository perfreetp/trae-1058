<template>
  <div>
    <div class="page-header">
      <div class="page-title">🔥 火险网格</div>
      <div class="flex gap-12">
        <button class="btn btn-default" @click="importWeather">📥 导入气象数据</button>
        <button class="btn btn-primary" @click="generateRiskLevel">🔄 重新计算火险等级</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">🗺️ 火险等级分布图</div>
        <div class="fire-legend">
          <div class="legend-item"><span class="legend-color fire-risk-1"></span>一级(低)</div>
          <div class="legend-item"><span class="legend-color fire-risk-2"></span>二级(较低)</div>
          <div class="legend-item"><span class="legend-color fire-risk-3"></span>三级(中)</div>
          <div class="legend-item"><span class="legend-color fire-risk-4"></span>四级(高)</div>
          <div class="legend-item"><span class="legend-color fire-risk-5"></span>五级(极高)</div>
        </div>
      </div>
      <div class="grid-container" style="grid-template-columns: repeat(5, 1fr); gap: 8px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <div
          v-for="cell in store.gridCells"
          :key="cell.id"
          :class="['grid-cell', `fire-risk-${cell.fireRiskLevel}`]"
          @click="selectedCell = cell"
          style="aspect-ratio: 1; border-radius: 8px;"
        >
          <span class="grid-cell-name" style="font-size: 18px;">{{ cell.name }}</span>
          <span style="color: white; font-size: 12px; margin-top: 4px;">{{ cell.vegetation }}</span>
        </div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 网格详情</div>
        </div>
        <div v-if="selectedCell" style="padding: 10px 0;">
          <div class="form-row mb-16">
            <div>
              <div style="color: #999; margin-bottom: 4px;">网格编号</div>
              <div style="font-size: 20px; font-weight: bold;">{{ selectedCell.name }}</div>
            </div>
            <div>
              <div style="color: #999; margin-bottom: 4px;">火险等级</div>
              <div>
                <span class="badge" :class="`badge-${getRiskBadgeClass(selectedCell.fireRiskLevel)}`" style="font-size: 14px; padding: 4px 12px;">
                  {{ getRiskText(selectedCell.fireRiskLevel) }}
                </span>
              </div>
            </div>
          </div>
          <div class="form-row mb-16">
            <div>
              <div style="color: #999; margin-bottom: 4px;">植被类型</div>
              <div>{{ selectedCell.vegetation }}</div>
            </div>
            <div>
              <div style="color: #999; margin-bottom: 4px;">网格面积</div>
              <div>{{ selectedCell.area }} 公顷</div>
            </div>
          </div>
          <div class="form-row mb-16">
            <div>
              <div style="color: #999; margin-bottom: 4px;">责任人</div>
              <div>{{ selectedCell.responsiblePerson }}</div>
            </div>
            <div>
              <div style="color: #999; margin-bottom: 4px;">联系电话</div>
              <div>{{ selectedCell.phone }}</div>
            </div>
          </div>
        </div>
        <div v-else style="text-align: center; color: #999; padding: 40px 0;">
          请点击上方网格查看详情
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🌡️ 近期气象数据</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>气温</th>
              <th>湿度</th>
              <th>风力</th>
              <th>火险等级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="w in store.weatherData.slice(-7).reverse()" :key="w.id">
              <td>{{ w.date }}</td>
              <td>{{ w.temperature }}℃</td>
              <td>{{ w.humidity }}%</td>
              <td>{{ w.windSpeed }}级 {{ w.windDirection }}风</td>
              <td>
                <span class="badge" :class="`badge-${getRiskBadgeClass(w.fireRiskLevel)}`">
                  {{ getRiskText(w.fireRiskLevel) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📈 火险等级统计</div>
      </div>
      <div ref="riskChartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useMainStore } from '@/store'
import type { GridCell } from '@/types'

const store = useMainStore()
const selectedCell = ref<GridCell | null>(null)
const riskChartRef = ref<HTMLElement>()

const riskStats = computed(() => {
  const stats: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  store.gridCells.forEach(cell => {
    stats[cell.fireRiskLevel]++
  })
  return stats
})

function getRiskText(level: number) {
  const texts = ['', '一级', '二级', '三级', '四级', '五级']
  return texts[level] || ''
}

function getRiskBadgeClass(level: number) {
  const classes = ['', 'success', 'success', 'warning', 'danger', 'danger']
  return classes[level] || 'info'
}

function importWeather() {
  alert('请选择气象数据文件（支持 Excel/CSV 格式）\n\n提示：实际项目中会调用文件选择对话框')
}

function generateRiskLevel() {
  if (confirm('确定要根据最新气象数据重新计算所有网格的火险等级吗？')) {
    store.gridCells.forEach(cell => {
      cell.fireRiskLevel = Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5
    })
    store.saveToLocalStorage()
    alert('火险等级已更新！')
  }
}

function initRiskChart() {
  if (!riskChartRef.value) return
  
  const chart = echarts.init(riskChartRef.value)
  
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 个网格 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['一级(低)', '二级(较低)', '三级(中)', '四级(高)', '五级(极高)']
    },
    series: [
      {
        name: '火险等级分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: riskStats.value[1], name: '一级(低)', itemStyle: { color: '#52c41a' } },
          { value: riskStats.value[2], name: '二级(较低)', itemStyle: { color: '#faad14' } },
          { value: riskStats.value[3], name: '三级(中)', itemStyle: { color: '#fa8c16' } },
          { value: riskStats.value[4], name: '四级(高)', itemStyle: { color: '#f5222d' } },
          { value: riskStats.value[5], name: '五级(极高)', itemStyle: { color: '#a8071a' } }
        ]
      }
    ]
  })
}

onMounted(() => {
  nextTick(() => {
    initRiskChart()
  })
})
</script>
