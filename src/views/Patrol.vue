<template>
  <div>
    <div class="page-header">
      <div class="page-title">🚶 巡护调度</div>
      <div class="flex gap-12">
        <button class="btn btn-default" @click="importPatrol">📥 导入巡护记录</button>
        <button class="btn btn-primary" @click="showDispatchModal = true">📋 派发巡护任务</button>
      </div>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-card-label">今日巡护任务</div>
        <div class="stat-card-value">{{ store.patrolRecords.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">巡护中</div>
        <div class="stat-card-value warning">{{ store.patrolRecords.filter(p => p.status === 'patrolling').length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">已完成</div>
        <div class="stat-card-value success">{{ store.patrolRecords.filter(p => p.status === 'completed').length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">总巡护里程</div>
        <div class="stat-card-value">{{ totalDistance.toFixed(1) }} km</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗺️ 巡护路线图</div>
        </div>
        <div class="map-container" style="height: 350px;">
          <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);">
            <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
              <path d="M 50,200 L 150,150 L 250,180 L 350,120 L 450,160" stroke="#1890ff" stroke-width="3" fill="none" stroke-dasharray="10,5"/>
              <path d="M 80,280 L 180,320 L 280,280 L 380,350" stroke="#52c41a" stroke-width="3" fill="none" stroke-dasharray="10,5"/>
              <path d="M 400,80 L 480,150 L 520,220" stroke="#faad14" stroke-width="3" fill="none" stroke-dasharray="10,5"/>
            </svg>
            <div v-for="(p, idx) in store.patrolRecords" :key="p.id" 
                 :style="{ position: 'absolute', left: (50 + idx * 30) + '%', top: (30 + idx * 15) + '%' }">
              <div :class="['status-badge', p.status === 'patrolling' ? 'warning' : p.status === 'completed' ? 'normal' : 'normal']"
                   style="background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                🚶 {{ p.patrolName }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">📋 巡护任务列表</div>
        </div>
        <div style="max-height: 350px; overflow-y: auto;">
          <div v-for="patrol in store.patrolRecords" :key="patrol.id" 
               style="padding: 16px; border-bottom: 1px solid #f0f0f0; cursor: pointer;"
               :class="{ 'bg-blue-50': selectedPatrol?.id === patrol.id }"
               @click="selectedPatrol = patrol">
            <div class="flex-between mb-8">
              <strong>{{ patrol.patrolName }}</strong>
              <span class="badge" :class="getStatusBadge(patrol.status)">
                {{ getStatusText(patrol.status) }}
              </span>
            </div>
            <div style="color: #666; font-size: 13px;">
              路线：{{ patrol.route }} | 里程：{{ patrol.distance }}km
            </div>
            <div style="color: #999; font-size: 12px; margin-top: 4px;">
              {{ patrol.startTime }} - {{ patrol.endTime || '进行中' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" v-if="selectedPatrol">
      <div class="card-header">
        <div class="card-title">📝 任务详情 - {{ selectedPatrol.patrolName }}</div>
      </div>
      <div class="two-col">
        <div>
          <div class="form-item">
            <label class="form-label">任务编号</label>
            <div>{{ selectedPatrol.patrolId }}</div>
          </div>
          <div class="form-item">
            <label class="form-label">巡护路线</label>
            <div>{{ selectedPatrol.route }}</div>
          </div>
          <div class="form-item">
            <label class="form-label">开始时间</label>
            <div>{{ selectedPatrol.startTime }}</div>
          </div>
        </div>
        <div>
          <div class="form-item">
            <label class="form-label">巡护里程</label>
            <div>{{ selectedPatrol.distance }} 公里</div>
          </div>
          <div class="form-item">
            <label class="form-label">结束时间</label>
            <div>{{ selectedPatrol.endTime || '未结束' }}</div>
          </div>
          <div class="form-item">
            <label class="form-label">巡护发现</label>
            <div>{{ selectedPatrol.findings || '暂无记录' }}</div>
          </div>
        </div>
      </div>
      <div class="flex gap-12" v-if="selectedPatrol.status === 'patrolling'">
        <button class="btn btn-success" @click="completePatrol">✅ 完成巡护</button>
        <button class="btn btn-default">📍 更新位置</button>
      </div>
    </div>

    <div v-if="showDispatchModal" class="modal-overlay" @click.self="showDispatchModal = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">📋 派发巡护任务</div>
          <button class="modal-close" @click="showDispatchModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">巡护组名称</label>
              <input class="form-input" v-model="newPatrol.patrolName" placeholder="请输入巡护组名称" />
            </div>
            <div class="form-item">
              <label class="form-label">巡护路线</label>
              <select class="form-select" v-model="newPatrol.route">
                <option value="">请选择路线</option>
                <option value="A区-1号路线">A区-1号路线</option>
                <option value="B区-2号路线">B区-2号路线</option>
                <option value="C区-3号路线">C区-3号路线</option>
                <option value="D区-4号路线">D区-4号路线</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">预计里程(km)</label>
              <input class="form-input" type="number" v-model.number="newPatrol.distance" />
            </div>
            <div class="form-item">
              <label class="form-label">计划开始时间</label>
              <input class="form-input" type="datetime-local" v-model="newPatrol.startTime" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showDispatchModal = false">取消</button>
          <button class="btn btn-primary" @click="dispatchPatrol">派发任务</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from '@/store'
import type { PatrolRecord } from '@/types'

const store = useMainStore()
const selectedPatrol = ref<PatrolRecord | null>(null)
const showDispatchModal = ref(false)

const newPatrol = ref({
  patrolName: '',
  route: '',
  distance: 10,
  startTime: ''
})

const totalDistance = computed(() => {
  return store.patrolRecords.reduce((sum, p) => sum + p.distance, 0)
})

function getStatusText(status: string) {
  const map: Record<string, string> = {
    patrolling: '巡护中',
    completed: '已完成',
    pending: '待出发'
  }
  return map[status] || status
}

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    patrolling: 'badge-warning',
    completed: 'badge-success',
    pending: 'badge-info'
  }
  return map[status] || 'badge-info'
}

function importPatrol() {
  alert('请选择巡护记录文件（支持 Excel/CSV 格式）')
}

function dispatchPatrol() {
  if (!newPatrol.value.patrolName || !newPatrol.value.route) {
    alert('请填写完整信息')
    return
  }
  
  const record: PatrolRecord = {
    id: Date.now().toString(),
    patrolId: 'XH' + Date.now().toString().slice(-8),
    patrolName: newPatrol.value.patrolName,
    route: newPatrol.value.route,
    distance: newPatrol.value.distance,
    startTime: newPatrol.value.startTime || new Date().toLocaleString('zh-CN'),
    endTime: '',
    status: 'pending',
    findings: ''
  }
  
  store.addPatrolRecord(record)
  store.saveToLocalStorage()
  
  showDispatchModal.value = false
  newPatrol.value = { patrolName: '', route: '', distance: 10, startTime: '' }
}

function completePatrol() {
  if (!selectedPatrol.value) return
  if (confirm(`确定要标记巡护任务【${selectedPatrol.value.patrolName}】为已完成吗？`)) {
    selectedPatrol.value.status = 'completed'
    selectedPatrol.value.endTime = new Date().toLocaleString('zh-CN')
    if (!selectedPatrol.value.findings) {
      selectedPatrol.value.findings = '巡护正常，无异常情况'
    }
    store.saveToLocalStorage()
  }
}
</script>
