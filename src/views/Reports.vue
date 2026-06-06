<template>
  <div>
    <div class="page-header">
      <div class="page-title">📈 统计报表</div>
      <div class="flex gap-12">
        <button class="btn btn-default" @click="exportDaily">📄 导出值班日报</button>
        <button class="btn btn-primary" @click="generateDailyReport">📝 生成今日日报</button>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-label">本月火情总数</div>
        <div class="stat-card-value">{{ store.firePoints.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">本月巡护次数</div>
        <div class="stat-card-value success">{{ store.patrolRecords.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">本月演练次数</div>
        <div class="stat-card-value warning">{{ store.drillRecords.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">值班日报</div>
        <div class="stat-card-value">{{ store.dailyReports.length }} 份</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 火情统计</div>
        </div>
        <div ref="fireChartRef" class="chart-container"></div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🚶 巡护统计</div>
        </div>
        <div ref="patrolChartRef" class="chart-container"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📋 值班日报列表</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>天气情况</th>
            <th>巡护次数</th>
            <th>火险等级</th>
            <th>值班领导</th>
            <th>生成时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in store.dailyReports" :key="report.id">
            <td><strong>{{ report.date }}</strong></td>
            <td>{{ report.weather }}</td>
            <td>{{ report.patrolCount }} 次</td>
            <td>
              <span class="badge badge-warning">{{ report.fireRisk }}</span>
            </td>
            <td>{{ report.dutyOfficer }}</td>
            <td>{{ report.createTime }}</td>
            <td>
              <div class="flex gap-8">
                <button class="btn btn-primary btn-sm" @click="viewReport(report)">查看</button>
                <button class="btn btn-default btn-sm" @click="exportOneReport(report)">导出</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">🔥 火险等级趋势</div>
      </div>
      <div ref="riskTrendChartRef" class="chart-container" style="height: 350px;"></div>
    </div>

    <div v-if="showReportModal" class="modal-overlay" @click.self="showReportModal = false">
      <div class="modal" style="width: 800px;">
        <div class="modal-header">
          <div class="modal-title">📄 值班日报 - {{ currentReport?.date }}</div>
          <button class="modal-close" @click="showReportModal = false">×</button>
        </div>
        <div class="modal-body">
          <div style="padding: 20px; background: white; border: 1px solid #e8e8e8; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="font-size: 24px; margin-bottom: 8px;">XX县森林防火值班日报</h2>
              <p style="color: #666;">{{ currentReport?.date }}</p>
            </div>
            
            <div class="form-item">
              <label class="form-label" style="font-weight: bold;">一、天气情况</label>
              <div>{{ currentReport?.weather }}</div>
            </div>
            
            <div class="form-item">
              <label class="form-label" style="font-weight: bold;">二、火险等级</label>
              <div>{{ currentReport?.fireRisk }}</div>
            </div>
            
            <div class="form-item">
              <label class="form-label" style="font-weight: bold;">三、巡护情况</label>
              <div>今日共组织巡护 {{ currentReport?.patrolCount }} 次，巡护人员全部在岗在位，巡护路线覆盖全部重点区域。</div>
            </div>
            
            <div class="form-item">
              <label class="form-label" style="font-weight: bold;">四、重要事件</label>
              <div>{{ currentReport?.events || '今日无重要事件发生，全县森林防火形势总体平稳。' }}</div>
            </div>
            
            <div class="form-item">
              <label class="form-label" style="font-weight: bold;">五、值班领导</label>
              <div>{{ currentReport?.dutyOfficer }}</div>
            </div>
            
            <div style="text-align: right; margin-top: 40px;">
              <p>生成时间：{{ currentReport?.createTime }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showReportModal = false">关闭</button>
          <button class="btn btn-primary" @click="exportOneReport(currentReport)">导出PDF</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useMainStore } from '@/store'
import type { DailyReport } from '@/types'
import { exportToExcel, exportToHTML } from '@/utils'

const store = useMainStore()
const fireChartRef = ref<HTMLElement>()
const patrolChartRef = ref<HTMLElement>()
const riskTrendChartRef = ref<HTMLElement>()
const showReportModal = ref(false)
const currentReport = ref<DailyReport | null>(null)

function initFireChart() {
  if (!fireChartRef.value) return
  
  const chart = echarts.init(fireChartRef.value)
  
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['火情数量', '已扑灭'],
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
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '火情数量',
        type: 'bar',
        data: [3, 5, 2, 8, 4, 2],
        itemStyle: { color: '#f5222d' }
      },
      {
        name: '已扑灭',
        type: 'bar',
        data: [3, 4, 2, 7, 4, 2],
        itemStyle: { color: '#52c41a' }
      }
    ]
  })
}

function initPatrolChart() {
  if (!patrolChartRef.value) return
  
  const chart = echarts.init(patrolChartRef.value)
  
  chart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '巡护统计',
        type: 'pie',
        radius: ['40%', '70%'],
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
          { value: 45, name: '专业队巡护', itemStyle: { color: '#1890ff' } },
          { value: 30, name: '半专业队巡护', itemStyle: { color: '#52c41a' } },
          { value: 15, name: '乡镇巡护', itemStyle: { color: '#faad14' } },
          { value: 10, name: '群众举报', itemStyle: { color: '#722ed1' } }
        ]
      }
    ]
  })
}

function initRiskTrendChart() {
  if (!riskTrendChartRef.value) return
  
  const chart = echarts.init(riskTrendChartRef.value)
  const data = store.weatherData.slice(-14)
  
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['火险等级', '温度', '湿度'],
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date.slice(5)),
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      max: 5
    },
    series: [
      {
        name: '火险等级',
        type: 'line',
        stack: 'Total',
        data: data.map(d => d.fireRiskLevel),
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: { color: '#f5222d' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245, 34, 45, 0.5)' },
            { offset: 1, color: 'rgba(245, 34, 45, 0.05)' }
          ])
        }
      },
      {
        name: '温度',
        type: 'line',
        data: data.map(d => d.temperature / 10),
        smooth: true,
        itemStyle: { color: '#fa8c16' }
      },
      {
        name: '湿度',
        type: 'line',
        data: data.map(d => d.humidity / 20),
        smooth: true,
        itemStyle: { color: '#1890ff' }
      }
    ]
  })
}

function generateDailyReport() {
  const today = new Date().toISOString().split('T')[0]
  const weather = store.weatherData[store.weatherData.length - 1]
  
  const report: DailyReport = {
    id: Date.now().toString(),
    date: today,
    weather: `晴，气温${weather?.temperature || 15}℃，湿度${weather?.humidity || 50}%，${weather?.windDirection || '北'}风${weather?.windSpeed || 3}级`,
    patrolCount: store.patrolRecords.length,
    fireRisk: '三级',
    events: '今日无火情发生，巡护正常开展，森林防火形势平稳。',
    dutyOfficer: '李主任',
    createTime: new Date().toLocaleString('zh-CN')
  }
  
  store.dailyReports.unshift(report)
  store.saveToLocalStorage()
  
  alert('今日值班日报已生成！')
}

function viewReport(report: DailyReport) {
  currentReport.value = report
  showReportModal.value = true
}

function exportDaily() {
  const data = store.dailyReports.map(r => ({
    '日期': r.date,
    '天气情况': r.weather,
    '巡护次数': r.patrolCount,
    '火险等级': r.fireRisk,
    '重要事件': r.events,
    '值班领导': r.dutyOfficer,
    '生成时间': r.createTime
  }))
  
  exportToExcel(data, '值班日报汇总.xlsx', '值班日报')
  alert('值班日报汇总已导出为 Excel 文件！')
}

function exportOneReport(report: DailyReport | null) {
  if (!report) return
  
  const content = `
    <h1>XX县森林防火值班日报</h1>
    <h2 style="text-align: center; color: #666;">${report.date}</h2>
    
    <div class="section">
      <h2>一、天气情况</h2>
      <p>${report.weather}</p>
    </div>
    
    <div class="section">
      <h2>二、火险等级</h2>
      <p>${report.fireRisk}</p>
    </div>
    
    <div class="section">
      <h2>三、巡护情况</h2>
      <p>今日共组织巡护 <strong>${report.patrolCount}</strong> 次，巡护人员全部在岗在位，巡护路线覆盖全部重点区域。</p>
    </div>
    
    <div class="section">
      <h2>四、重要事件</h2>
      <p>${report.events}</p>
    </div>
    
    <div class="section">
      <h2>五、值班领导</h2>
      <p>${report.dutyOfficer}</p>
    </div>
    
    <div style="text-align: right; margin-top: 40px;">
      <p>生成时间：${report.createTime}</p>
    </div>
  `
  
  exportToHTML('值班日报 - ' + report.date, content, `值班日报_${report.date}.html`)
  alert('值班日报已导出为 HTML 文件，可用浏览器打开或打印为PDF！')
}

onMounted(() => {
  nextTick(() => {
    initFireChart()
    initPatrolChart()
    initRiskTrendChart()
  })
})
</script>
