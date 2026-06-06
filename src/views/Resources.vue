<template>
  <div>
    <div class="page-header">
      <div class="page-title">📦 物资队伍</div>
      <div class="flex gap-12">
        <button class="btn btn-default" @click="markWatchTower">🗼 标注瞭望塔</button>
        <button class="btn btn-default" @click="markWaterSource">💧 标注水源</button>
        <button class="btn btn-primary" @click="showTeamModal = true">👥 登记队伍</button>
      </div>
    </div>

    <div class="tabs">
      <div class="tab-item" :class="{ active: activeTab === 'teams' }" @click="activeTab = 'teams'">👥 扑火队伍</div>
      <div class="tab-item" :class="{ active: activeTab === 'equipments' }" @click="activeTab = 'equipments'">⚙️ 装备物资</div>
      <div class="tab-item" :class="{ active: activeTab === 'watchtowers' }" @click="activeTab = 'watchtowers'">🗼 瞭望塔</div>
      <div class="tab-item" :class="{ active: activeTab === 'watersources' }" @click="activeTab = 'watersources'">💧 水源地</div>
    </div>

    <div v-if="activeTab === 'teams'">
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-card-label">专业扑火队</div>
          <div class="stat-card-value">{{ store.fireTeams.filter(t => t.name.includes('专业')).length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">半专业队</div>
          <div class="stat-card-value">{{ store.fireTeams.filter(t => t.name.includes('半专业')).length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">总人数</div>
          <div class="stat-card-value success">{{ totalMembers }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">待命状态</div>
          <div class="stat-card-value warning">{{ store.fireTeams.filter(t => t.status === 'standby').length }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">👥 扑火队伍列表</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>队伍名称</th>
              <th>队长</th>
              <th>联系电话</th>
              <th>人数</th>
              <th>状态</th>
              <th>所在位置</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in store.fireTeams" :key="team.id">
              <td><strong>{{ team.name }}</strong></td>
              <td>{{ team.leader }}</td>
              <td>{{ team.phone }}</td>
              <td>{{ team.memberCount }} 人</td>
              <td>
                <span class="badge" :class="getTeamBadgeClass(team.status)">
                  {{ getTeamStatusText(team.status) }}
                </span>
              </td>
              <td>{{ team.location }}</td>
              <td>
                <div class="flex gap-8">
                  <button class="btn btn-primary btn-sm">详情</button>
                  <button class="btn btn-default btn-sm">调度</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'equipments'">
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-card-label">装备种类</div>
          <div class="stat-card-value">{{ store.equipments.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">正常可用</div>
          <div class="stat-card-value success">{{ store.equipments.filter(e => e.status === 'normal').length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">待维护</div>
          <div class="stat-card-value warning">{{ store.equipments.filter(e => e.status === 'maintenance').length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">已损坏</div>
          <div class="stat-card-value danger">{{ store.equipments.filter(e => e.status === 'damaged').length }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">⚙️ 装备库存管理</div>
          <button class="btn btn-primary btn-sm">+ 新增装备</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>装备名称</th>
              <th>类别</th>
              <th>数量</th>
              <th>单位</th>
              <th>存放位置</th>
              <th>状态</th>
              <th>最近检查</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eq in store.equipments" :key="eq.id">
              <td><strong>{{ eq.name }}</strong></td>
              <td>{{ eq.category }}</td>
              <td>{{ eq.quantity }}</td>
              <td>{{ eq.unit }}</td>
              <td>{{ eq.location }}</td>
              <td>
                <span class="badge" :class="getEquipBadgeClass(eq.status)">
                  {{ getEquipStatusText(eq.status) }}
                </span>
              </td>
              <td>{{ eq.lastCheckDate }}</td>
              <td>
                <button class="btn btn-default btn-sm">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'watchtowers'">
      <div class="two-col">
        <div class="card">
          <div class="card-header">
            <div class="card-title">🗺️ 瞭望塔分布</div>
          </div>
          <div class="map-container" style="height: 350px;">
            <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%);">
              <div v-for="(tower, idx) in store.watchTowers" :key="tower.id"
                   :style="{ position: 'absolute', left: (20 + idx * 30) + '%', top: (30 + idx * 20) + '%' }">
                <div style="background: #1890ff; color: white; padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);">
                  🗼 {{ tower.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🗼 瞭望塔列表</div>
          </div>
          <div style="max-height: 350px; overflow-y: auto;">
            <div v-for="tower in store.watchTowers" :key="tower.id" style="padding: 16px; border-bottom: 1px solid #f0f0f0;">
              <div class="flex-between mb-8">
                <strong>{{ tower.name }}</strong>
                <span class="badge badge-info">高度{{ tower.height }}m</span>
              </div>
              <div style="color: #666; font-size: 13px;">
                瞭望范围：{{ tower.range }}公里 | 值守员：{{ tower.keeper }}
              </div>
              <div style="color: #999; font-size: 12px; margin-top: 4px;">
                联系电话：{{ tower.phone }}
              </div>
              <div style="color: #999; font-size: 12px;">
                位置：{{ tower.lng }}, {{ tower.lat }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'watersources'">
      <div class="two-col">
        <div class="card">
          <div class="card-header">
            <div class="card-title">🗺️ 水源地分布</div>
          </div>
          <div class="map-container" style="height: 350px;">
            <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%);">
              <div v-for="(ws, idx) in store.waterSources" :key="ws.id"
                   :style="{ position: 'absolute', left: (25 + idx * 25) + '%', top: (35 + idx * 15) + '%' }">
                <div style="background: #13c2c2; color: white; padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 8px rgba(19, 194, 194, 0.3);">
                  💧 {{ ws.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">💧 水源地列表</div>
          </div>
          <div style="max-height: 350px; overflow-y: auto;">
            <div v-for="ws in store.waterSources" :key="ws.id" style="padding: 16px; border-bottom: 1px solid #f0f0f0;">
              <div class="flex-between mb-8">
                <strong>{{ ws.name }}</strong>
                <span class="badge badge-info">{{ getWaterTypeText(ws.type) }}</span>
              </div>
              <div style="color: #666; font-size: 13px;">
                容量：{{ ws.capacity.toLocaleString() }} 立方米
              </div>
              <div style="color: #999; font-size: 12px; margin-top: 4px;">
                位置：{{ ws.lng }}, {{ ws.lat }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTeamModal" class="modal-overlay" @click.self="showTeamModal = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">👥 登记扑火队伍</div>
          <button class="modal-close" @click="showTeamModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label class="form-label">队伍名称</label>
            <input class="form-input" v-model="newTeam.name" placeholder="请输入队伍名称" />
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">队长</label>
              <input class="form-input" v-model="newTeam.leader" placeholder="请输入队长姓名" />
            </div>
            <div class="form-item">
              <label class="form-label">联系电话</label>
              <input class="form-input" v-model="newTeam.phone" placeholder="请输入联系电话" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">人数</label>
              <input class="form-input" type="number" v-model.number="newTeam.memberCount" />
            </div>
            <div class="form-item">
              <label class="form-label">驻扎位置</label>
              <input class="form-input" v-model="newTeam.location" placeholder="请输入驻扎位置" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showTeamModal = false">取消</button>
          <button class="btn btn-primary" @click="saveTeam">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from '@/store'
import type { FireTeam } from '@/types'

const store = useMainStore()
const activeTab = ref('teams')
const showTeamModal = ref(false)

const newTeam = ref({
  name: '',
  leader: '',
  phone: '',
  memberCount: 15,
  location: ''
})

const totalMembers = computed(() => {
  return store.fireTeams.reduce((sum, t) => sum + t.memberCount, 0)
})

function getTeamStatusText(status: string) {
  const map: Record<string, string> = {
    standby: '待命',
    onmission: '执行任务',
    rest: '休整'
  }
  return map[status] || status
}

function getTeamBadgeClass(status: string) {
  const map: Record<string, string> = {
    standby: 'badge-success',
    onmission: 'badge-danger',
    rest: 'badge-warning'
  }
  return map[status] || 'badge-info'
}

function getEquipStatusText(status: string) {
  const map: Record<string, string> = {
    normal: '正常',
    damaged: '损坏',
    maintenance: '维护中'
  }
  return map[status] || status
}

function getEquipBadgeClass(status: string) {
  const map: Record<string, string> = {
    normal: 'badge-success',
    damaged: 'badge-danger',
    maintenance: 'badge-warning'
  }
  return map[status] || 'badge-info'
}

function getWaterTypeText(type: string) {
  const map: Record<string, string> = {
    reservoir: '水库',
    river: '河流',
    well: '水井',
    pond: '蓄水池'
  }
  return map[type] || type
}

function markWatchTower() {
  alert('请在地图上点击位置标注瞭望塔\n\n提示：实际项目中会在地图上交互标注')
}

function markWaterSource() {
  alert('请在地图上点击位置标注水源地\n\n提示：实际项目中会在地图上交互标注')
}

function saveTeam() {
  if (!newTeam.value.name || !newTeam.value.leader) {
    alert('请填写必要信息')
    return
  }
  
  const team: FireTeam = {
    id: Date.now().toString(),
    name: newTeam.value.name,
    leader: newTeam.value.leader,
    phone: newTeam.value.phone,
    memberCount: newTeam.value.memberCount,
    equipment: [],
    status: 'standby',
    location: newTeam.value.location
  }
  
  store.fireTeams.push(team)
  store.saveToLocalStorage()
  
  showTeamModal.value = false
  newTeam.value = { name: '', leader: '', phone: '', memberCount: 15, location: '' }
  
  alert('队伍登记成功！')
}
</script>
