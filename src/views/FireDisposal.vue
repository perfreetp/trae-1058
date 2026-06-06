<template>
  <div>
    <div class="page-header">
      <div class="page-title">🚒 火情处置</div>
      <div class="flex gap-12">
        <button class="btn btn-default" @click="locateSmoke">📍 定位烟点</button>
        <button class="btn btn-warning" @click="showReportModal = true">🔥 火点上报</button>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-label">待核实火情</div>
        <div class="stat-card-value warning">{{ store.firePoints.filter(f => f.status === 'reported').length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">处置中</div>
        <div class="stat-card-value danger">{{ store.firePoints.filter(f => ['verified', 'disposing'].includes(f.status)).length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">疑似烟点</div>
        <div class="stat-card-value">{{ store.smokePoints.filter(s => s.status === 'suspected').length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">已扑灭</div>
        <div class="stat-card-value success">{{ store.firePoints.filter(f => f.status === 'extinguished').length }}</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗺️ 火情分布地图</div>
        </div>
        <div class="map-container" style="height: 400px;">
          <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);">
            <div v-for="fire in store.firePoints" :key="fire.id"
                 :style="{ position: 'absolute', left: (20 + Math.random() * 60) + '%', top: (20 + Math.random() * 60) + '%' }">
              <div :class="['status-badge', fire.status === 'extinguished' ? 'normal' : fire.status === 'controlled' ? 'warning' : 'danger']"
                   style="background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); animation: fire.status !== 'extinguished' ? 'pulse 2s infinite' : 'none';">
                🔥 {{ fire.location }}
              </div>
            </div>
            <div v-for="smoke in store.smokePoints.filter(s => s.status !== 'false_alarm')" :key="smoke.id"
                 :style="{ position: 'absolute', left: (30 + Math.random() * 50) + '%', top: (30 + Math.random() * 50) + '%' }">
              <div class="status-badge warning" style="background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                💨 烟点{{ smoke.id.slice(-2) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">📋 火情列表</div>
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
          <div v-for="fire in store.firePoints" :key="fire.id"
               style="padding: 16px; border-bottom: 1px solid #f0f0f0; cursor: pointer;"
               :style="{ background: selectedFire?.id === fire.id ? '#e6f7ff' : '' }"
               @click="selectFire(fire)">
            <div class="flex-between mb-8">
              <strong>{{ fire.location }}</strong>
              <span class="badge" :class="getFireBadgeClass(fire.status)">
                {{ getFireStatusText(fire.status) }}
              </span>
            </div>
            <div style="color: #666; font-size: 13px;">
              等级：{{ getLevelText(fire.level) }} | 上报人：{{ fire.reporter }}
            </div>
            <div style="color: #999; font-size: 12px; margin-top: 4px;">
              {{ fire.reportTime }} | 预计面积：{{ fire.estimatedArea }}公顷
            </div>
            <div v-if="fire.spreadDirection" style="color: #f5222d; font-size: 12px; margin-top: 4px;">
              蔓延方向：{{ fire.spreadDirection }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedFire" class="two-col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📝 火情详情 - {{ selectedFire.location }}</div>
          <div class="flex gap-8">
            <button v-if="selectedFire.status === 'reported'" class="btn btn-primary btn-sm" @click="updateStatus('verified')">核实火情</button>
            <button v-if="selectedFire.status === 'verified'" class="btn btn-warning btn-sm" @click="updateStatus('disposing')">开始处置</button>
            <button v-if="selectedFire.status === 'disposing'" class="btn btn-success btn-sm" @click="updateStatus('controlled')">控制火势</button>
            <button v-if="selectedFire.status === 'controlled'" class="btn btn-success btn-sm" @click="updateStatus('extinguished')">扑灭确认</button>
          </div>
        </div>
        <div class="form-row mb-12">
          <div>
            <div style="color: #999; margin-bottom: 4px;">火情等级</div>
            <div>
              <span class="badge badge-danger" style="font-size: 14px; padding: 4px 12px;">{{ getLevelText(selectedFire.level) }}</span>
            </div>
          </div>
          <div>
            <div style="color: #999; margin-bottom: 4px;">上报时间</div>
            <div>{{ selectedFire.reportTime }}</div>
          </div>
        </div>
        <div class="form-row mb-12">
          <div>
            <div style="color: #999; margin-bottom: 4px;">经纬度</div>
            <div>{{ selectedFire.lng }}, {{ selectedFire.lat }}</div>
          </div>
          <div>
            <div style="color: #999; margin-bottom: 4px;">蔓延方向</div>
            <div>{{ selectedFire.spreadDirection || '待分析' }}</div>
          </div>
        </div>
        <div class="form-item">
          <div style="color: #999; margin-bottom: 4px;">火情描述</div>
          <div>{{ selectedFire.description }}</div>
        </div>
        <div class="form-item">
          <div style="color: #999; margin-bottom: 4px;">现场照片</div>
          <div class="flex gap-8">
            <div style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999;">
              📷 照片1
            </div>
            <div style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999;">
              📷 照片2
            </div>
            <button class="btn btn-default btn-sm" style="height: 80px; width: 80px;">+ 上传</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">⏱️ 处置时间线</div>
          <button class="btn btn-primary btn-sm" @click="showTimelineModal = true">+ 添加记录</button>
        </div>
        <div class="timeline">
          <div v-for="event in store.timelineEvents.filter(e => e.fireId === selectedFire.id)" :key="event.id" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-time">{{ event.time }} | {{ getEventTypeText(event.type) }}</div>
            <div class="timeline-content">
              <div>{{ event.description }}</div>
              <div style="color: #999; font-size: 12px; margin-top: 4px;">操作人：{{ event.operator }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">👥 群众转移点设置</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>转移点名称</th>
            <th>地址</th>
            <th>容量</th>
            <th>联系人</th>
            <th>联系电话</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point in store.evacuationPoints" :key="point.id">
            <td>{{ point.name }}</td>
            <td>{{ point.address }}</td>
            <td>{{ point.capacity }} 人</td>
            <td>{{ point.contact }}</td>
            <td>{{ point.phone }}</td>
            <td>
              <button class="btn btn-primary btn-sm">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showReportModal" class="modal-overlay" @click.self="showReportModal = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">🔥 火点上报</div>
          <button class="modal-close" @click="showReportModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">火情位置</label>
              <input class="form-input" v-model="newFire.location" placeholder="请输入具体位置" />
            </div>
            <div class="form-item">
              <label class="form-label">火情等级</label>
              <select class="form-select" v-model.number="newFire.level">
                <option :value="1">一级</option>
                <option :value="2">二级</option>
                <option :value="3">三级</option>
                <option :value="4">四级</option>
                <option :value="5">五级</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">经度</label>
              <input class="form-input" type="number" step="0.0001" v-model.number="newFire.lng" />
            </div>
            <div class="form-item">
              <label class="form-label">纬度</label>
              <input class="form-input" type="number" step="0.0001" v-model.number="newFire.lat" />
            </div>
          </div>
          <div class="form-item">
            <label class="form-label">上报人</label>
            <input class="form-input" v-model="newFire.reporter" placeholder="请输入上报人姓名" />
          </div>
          <div class="form-item">
            <label class="form-label">火情描述</label>
            <textarea class="form-textarea" v-model="newFire.description" placeholder="请描述火情情况"></textarea>
          </div>
          <div class="form-item">
            <label class="form-label">蔓延方向</label>
            <select class="form-select" v-model="newFire.spreadDirection">
              <option value="">待分析</option>
              <option value="东">东</option>
              <option value="南">南</option>
              <option value="西">西</option>
              <option value="北">北</option>
              <option value="东北">东北</option>
              <option value="东南">东南</option>
              <option value="西南">西南</option>
              <option value="西北">西北</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showReportModal = false">取消</button>
          <button class="btn btn-primary" @click="reportFire">上报</button>
        </div>
      </div>
    </div>

    <div v-if="showTimelineModal" class="modal-overlay" @click.self="showTimelineModal = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">⏱️ 添加处置记录</div>
          <button class="modal-close" @click="showTimelineModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label class="form-label">事件类型</label>
            <select class="form-select" v-model="newTimelineEvent.type">
              <option value="report">接报</option>
              <option value="dispatch">调派</option>
              <option value="arrival">到达</option>
              <option value="control">控制</option>
              <option value="extinguish">扑灭</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="form-item">
            <label class="form-label">事件描述</label>
            <textarea class="form-textarea" v-model="newTimelineEvent.description" placeholder="请输入事件描述"></textarea>
          </div>
          <div class="form-item">
            <label class="form-label">操作人</label>
            <input class="form-input" v-model="newTimelineEvent.operator" placeholder="请输入操作人" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showTimelineModal = false">取消</button>
          <button class="btn btn-primary" @click="addTimelineEvent">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/store'
import type { FirePoint, TimelineEvent } from '@/types'

const store = useMainStore()
const selectedFire = ref<FirePoint | null>(null)
const showReportModal = ref(false)
const showTimelineModal = ref(false)

const newFire = ref({
  location: '',
  level: 2 as 1 | 2 | 3 | 4 | 5,
  lng: 116.4,
  lat: 39.9,
  reporter: '',
  description: '',
  spreadDirection: ''
})

const newTimelineEvent = ref({
  type: 'other' as TimelineEvent['type'],
  description: '',
  operator: ''
})

function getFireStatusText(status: string) {
  const map: Record<string, string> = {
    reported: '待核实',
    verified: '已核实',
    disposing: '处置中',
    controlled: '已控制',
    extinguished: '已扑灭'
  }
  return map[status] || status
}

function getFireBadgeClass(status: string) {
  const map: Record<string, string> = {
    reported: 'badge-warning',
    verified: 'badge-warning',
    disposing: 'badge-danger',
    controlled: 'badge-warning',
    extinguished: 'badge-success'
  }
  return map[status] || 'badge-info'
}

function getLevelText(level: number) {
  const texts = ['', '一级', '二级', '三级', '四级', '五级']
  return texts[level] || ''
}

function getEventTypeText(type: string) {
  const map: Record<string, string> = {
    report: '接报',
    dispatch: '调派',
    arrival: '到达',
    control: '控制',
    extinguish: '扑灭',
    other: '其他'
  }
  return map[type] || type
}

function selectFire(fire: FirePoint) {
  selectedFire.value = fire
}

function locateSmoke() {
  alert('正在通过卫星和监控系统扫描疑似烟点...')
}

function reportFire() {
  if (!newFire.value.location || !newFire.value.reporter) {
    alert('请填写必要信息')
    return
  }
  
  const fire: Omit<FirePoint, 'id'> = {
    reportTime: new Date().toLocaleString('zh-CN'),
    reporter: newFire.value.reporter,
    location: newFire.value.location,
    lng: newFire.value.lng,
    lat: newFire.value.lat,
    level: newFire.value.level,
    status: 'reported',
    description: newFire.value.description,
    spreadDirection: newFire.value.spreadDirection,
    estimatedArea: 0
  }
  
  const savedFire = store.addFirePoint(fire)
  
  store.addTimelineEvent({
    fireId: savedFire.id,
    time: fire.reportTime,
    type: 'report',
    description: `接报${fire.location}发现火情，等级：${getLevelText(fire.level)}`,
    operator: fire.reporter
  })
  
  store.saveToLocalStorage()
  
  showReportModal.value = false
  newFire.value = { location: '', level: 2, lng: 116.4, lat: 39.9, reporter: '', description: '', spreadDirection: '' }
  
  alert('火情已上报！')
}

function updateStatus(status: FirePoint['status']) {
  if (!selectedFire.value) return
  
  store.updateFirePointStatus(selectedFire.value.id, status)
  
  const typeMap: Record<string, TimelineEvent['type']> = {
    verified: 'report',
    disposing: 'dispatch',
    controlled: 'control',
    extinguished: 'extinguish'
  }
  
  store.addTimelineEvent({
    fireId: selectedFire.value.id,
    time: new Date().toLocaleString('zh-CN'),
    type: typeMap[status] || 'other',
    description: `火情状态更新为：${getFireStatusText(status)}`,
    operator: '值班员'
  })
  
  store.saveToLocalStorage()
}

function addTimelineEvent() {
  if (!selectedFire.value || !newTimelineEvent.value.description) {
    alert('请填写事件描述')
    return
  }
  
  store.addTimelineEvent({
    fireId: selectedFire.value.id,
    time: new Date().toLocaleString('zh-CN'),
    type: newTimelineEvent.value.type,
    description: newTimelineEvent.value.description,
    operator: newTimelineEvent.value.operator || '值班员'
  })
  
  store.saveToLocalStorage()
  
  showTimelineModal.value = false
  newTimelineEvent.value = { type: 'other', description: '', operator: '' }
}
</script>
