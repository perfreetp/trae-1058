<template>
  <div>
    <div class="page-header">
      <div class="page-title">📦 物资队伍</div>
      <div class="flex gap-12">
        <button class="btn btn-default" @click="openWatchTowerModal">🗼 标注瞭望塔</button>
        <button class="btn btn-default" @click="openWaterSourceModal">💧 标注水源</button>
        <button class="btn btn-primary" @click="showTeamModal = true">👥 登记队伍</button>
      </div>
    </div>

    <div class="tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'teams' }" 
        @click="activeTab = 'teams'"
      >👥 扑火队伍</div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'equipments' }" 
        @click="activeTab = 'equipments'"
      >⚙️ 装备物资</div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'watchtowers' }" 
        @click="activeTab = 'watchtowers'"
      >🗼 瞭望塔</div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'watersources' }" 
        @click="activeTab = 'watersources'"
      >💧 水源地</div>
    </div>

    <!-- 扑火队伍 -->
    <div v-if="activeTab === 'teams'">
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-card-label">专业扑火队</div>
          <div class="stat-card-value">{{ countProfessionalTeams }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">半专业队</div>
          <div class="stat-card-value">{{ countSemiProfessionalTeams }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">总人数</div>
          <div class="stat-card-value success">{{ totalMembers }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">待命状态</div>
          <div class="stat-card-value warning">{{ countStandbyTeams }}</div>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 装备物资 -->
    <div v-if="activeTab === 'equipments'">
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-card-label">装备种类</div>
          <div class="stat-card-value">{{ store.equipments.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">正常可用</div>
          <div class="stat-card-value success">{{ countNormalEquip }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">待维护</div>
          <div class="stat-card-value warning">{{ countMaintenanceEquip }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">已损坏</div>
          <div class="stat-card-value danger">{{ countDamagedEquip }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">⚙️ 装备库存管理</div>
          <button class="btn btn-primary btn-sm" @click="openEquipmentModal()">+ 新增装备</button>
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
                <div class="flex gap-8">
                  <button class="btn btn-primary btn-sm" @click="openEquipmentModal(eq)">编辑</button>
                  <button class="btn btn-danger btn-sm" @click="deleteEquipment(eq.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 瞭望塔 -->
    <div v-if="activeTab === 'watchtowers'">
      <div class="two-col">
        <div class="card">
          <div class="card-header">
            <div class="card-title">🗺️ 瞭望塔分布</div>
            <button class="btn btn-primary btn-sm" @click="openWatchTowerModal">+ 新增</button>
          </div>
          <div class="map-container" style="height: 350px;">
            <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%);">
              <div 
                v-for="(tower, idx) in store.watchTowers" 
                :key="tower.id"
                :style="{ 
                  position: 'absolute', 
                  left: (10 + (idx % 3) * 30) + '%', 
                  top: (20 + Math.floor(idx / 3) * 30) + '%' 
                }"
              >
                <div style="background: #1890ff; color: white; padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3); font-size: 12px;">
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
            <div 
              v-for="tower in store.watchTowers" 
              :key="tower.id" 
              style="padding: 16px; border-bottom: 1px solid #f0f0f0;"
            >
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

    <!-- 水源地 -->
    <div v-if="activeTab === 'watersources'">
      <div class="two-col">
        <div class="card">
          <div class="card-header">
            <div class="card-title">🗺️ 水源地分布</div>
            <button class="btn btn-primary btn-sm" @click="openWaterSourceModal">+ 新增</button>
          </div>
          <div class="map-container" style="height: 350px;">
            <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%);">
              <div 
                v-for="(ws, idx) in store.waterSources" 
                :key="ws.id"
                :style="{ 
                  position: 'absolute', 
                  left: (15 + (idx % 3) * 25) + '%', 
                  top: (25 + Math.floor(idx / 3) * 25) + '%' 
                }"
              >
                <div style="background: #13c2c2; color: white; padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 8px rgba(19, 194, 194, 0.3); font-size: 12px;">
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
            <div 
              v-for="ws in store.waterSources" 
              :key="ws.id" 
              style="padding: 16px; border-bottom: 1px solid #f0f0f0;"
            >
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

    <!-- 队伍登记弹窗 -->
    <div v-if="showTeamModal" class="modal-overlay" @click.self="closeTeamModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">👥 登记扑火队伍</div>
          <button class="modal-close" @click="closeTeamModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label class="form-label">队伍名称</label>
            <input class="form-input" v-model="teamForm.name" placeholder="请输入队伍名称" />
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">队长</label>
              <input class="form-input" v-model="teamForm.leader" placeholder="请输入队长姓名" />
            </div>
            <div class="form-item">
              <label class="form-label">联系电话</label>
              <input class="form-input" v-model="teamForm.phone" placeholder="请输入联系电话" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">人数</label>
              <input class="form-input" type="number" v-model.number="teamForm.memberCount" />
            </div>
            <div class="form-item">
              <label class="form-label">驻扎位置</label>
              <input class="form-input" v-model="teamForm.location" placeholder="请输入驻扎位置" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closeTeamModal">取消</button>
          <button class="btn btn-primary" @click="saveTeam">保存</button>
        </div>
      </div>
    </div>

    <!-- 瞭望塔弹窗 -->
    <div v-if="showWatchTowerModal" class="modal-overlay" @click.self="closeWatchTowerModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">🗼 {{ editingTower ? '编辑' : '标注' }}瞭望塔</div>
          <button class="modal-close" @click="closeWatchTowerModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label class="form-label">瞭望塔名称</label>
            <input class="form-input" v-model="towerForm.name" placeholder="请输入瞭望塔名称" />
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">经度</label>
              <input class="form-input" type="number" step="0.0001" v-model.number="towerForm.lng" placeholder="如：116.4074" />
            </div>
            <div class="form-item">
              <label class="form-label">纬度</label>
              <input class="form-input" type="number" step="0.0001" v-model.number="towerForm.lat" placeholder="如：39.9042" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">塔高(米)</label>
              <input class="form-input" type="number" v-model.number="towerForm.height" />
            </div>
            <div class="form-item">
              <label class="form-label">瞭望范围(公里)</label>
              <input class="form-input" type="number" v-model.number="towerForm.range" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">值守员</label>
              <input class="form-input" v-model="towerForm.keeper" placeholder="请输入值守员姓名" />
            </div>
            <div class="form-item">
              <label class="form-label">联系电话</label>
              <input class="form-input" v-model="towerForm.phone" placeholder="请输入联系电话" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closeWatchTowerModal">取消</button>
          <button class="btn btn-primary" @click="saveWatchTower">保存</button>
        </div>
      </div>
    </div>

    <!-- 水源地弹窗 -->
    <div v-if="showWaterSourceModal" class="modal-overlay" @click.self="closeWaterSourceModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">💧 {{ editingWaterSource ? '编辑' : '标注' }}水源地</div>
          <button class="modal-close" @click="closeWaterSourceModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label class="form-label">水源名称</label>
            <input class="form-input" v-model="waterForm.name" placeholder="请输入水源名称" />
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">水源类型</label>
              <select class="form-select" v-model="waterForm.type">
                <option value="reservoir">水库</option>
                <option value="river">河流</option>
                <option value="well">水井</option>
                <option value="pond">蓄水池</option>
              </select>
            </div>
            <div class="form-item">
              <label class="form-label">容量(立方米)</label>
              <input class="form-input" type="number" v-model.number="waterForm.capacity" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">经度</label>
              <input class="form-input" type="number" step="0.0001" v-model.number="waterForm.lng" placeholder="如：116.4074" />
            </div>
            <div class="form-item">
              <label class="form-label">纬度</label>
              <input class="form-input" type="number" step="0.0001" v-model.number="waterForm.lat" placeholder="如：39.9042" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closeWaterSourceModal">取消</button>
          <button class="btn btn-primary" @click="saveWaterSource">保存</button>
        </div>
      </div>
    </div>

    <!-- 装备弹窗 -->
    <div v-if="showEquipmentModal" class="modal-overlay" @click.self="closeEquipmentModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">⚙️ {{ editingEquipment ? '编辑' : '新增' }}装备</div>
          <button class="modal-close" @click="closeEquipmentModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">装备名称</label>
              <input class="form-input" v-model="equipForm.name" placeholder="请输入装备名称" />
            </div>
            <div class="form-item">
              <label class="form-label">类别</label>
              <select class="form-select" v-model="equipForm.category">
                <option value="灭火装备">灭火装备</option>
                <option value="防护装备">防护装备</option>
                <option value="通讯设备">通讯设备</option>
                <option value="侦查设备">侦查设备</option>
                <option value="运输装备">运输装备</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">数量</label>
              <input class="form-input" type="number" v-model.number="equipForm.quantity" />
            </div>
            <div class="form-item">
              <label class="form-label">单位</label>
              <select class="form-select" v-model="equipForm.unit">
                <option value="台">台</option>
                <option value="支">支</option>
                <option value="套">套</option>
                <option value="部">部</option>
                <option value="架">架</option>
                <option value="件">件</option>
                <option value="个">个</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">存放位置</label>
              <input class="form-input" v-model="equipForm.location" placeholder="请输入存放位置" />
            </div>
            <div class="form-item">
              <label class="form-label">状态</label>
              <select class="form-select" v-model="equipForm.status">
                <option value="normal">正常</option>
                <option value="maintenance">维护中</option>
                <option value="damaged">损坏</option>
              </select>
            </div>
          </div>
          <div class="form-item">
            <label class="form-label">最近检查日期</label>
            <input class="form-input" type="date" v-model="equipForm.lastCheckDate" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closeEquipmentModal">取消</button>
          <button class="btn btn-primary" @click="saveEquipment">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from '@/store'
import type { FireTeam, WatchTower, WaterSource, Equipment } from '@/types'

const store = useMainStore()
const activeTab = ref('teams')

// 弹窗状态
const showTeamModal = ref(false)
const showWatchTowerModal = ref(false)
const showWaterSourceModal = ref(false)
const showEquipmentModal = ref(false)

// 编辑状态
const editingTower = ref<WatchTower | null>(null)
const editingWaterSource = ref<WaterSource | null>(null)
const editingEquipment = ref<Equipment | null>(null)

// 表单数据 - 使用简单的对象，避免类型问题
const teamForm = ref({
  name: '',
  leader: '',
  phone: '',
  memberCount: 15,
  location: ''
})

const towerForm = ref({
  name: '',
  lng: 116.4074,
  lat: 39.9042,
  height: 20,
  range: 10,
  keeper: '',
  phone: ''
})

const waterForm = ref({
  name: '',
  type: 'reservoir',
  lng: 116.4074,
  lat: 39.9042,
  capacity: 10000
})

const equipForm = ref({
  name: '',
  category: '灭火装备',
  quantity: 1,
  unit: '台',
  location: '',
  status: 'normal',
  lastCheckDate: new Date().toISOString().split('T')[0]
})

// 统计计算
const countProfessionalTeams = computed(() => {
  return store.fireTeams.filter(t => t.name.includes('专业')).length
})

const countSemiProfessionalTeams = computed(() => {
  return store.fireTeams.filter(t => t.name.includes('半专业')).length
})

const totalMembers = computed(() => {
  return store.fireTeams.reduce((sum, t) => sum + t.memberCount, 0)
})

const countStandbyTeams = computed(() => {
  return store.fireTeams.filter(t => t.status === 'standby').length
})

const countNormalEquip = computed(() => {
  return store.equipments.filter(e => e.status === 'normal').length
})

const countMaintenanceEquip = computed(() => {
  return store.equipments.filter(e => e.status === 'maintenance').length
})

const countDamagedEquip = computed(() => {
  return store.equipments.filter(e => e.status === 'damaged').length
})

// 工具函数
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

// 弹窗操作
function openWatchTowerModal(tower?: WatchTower) {
  editingTower.value = tower || null
  if (tower) {
    towerForm.value = { ...tower }
  } else {
    towerForm.value = {
      name: '',
      lng: 116.4074,
      lat: 39.9042,
      height: 20,
      range: 10,
      keeper: '',
      phone: ''
    }
  }
  showWatchTowerModal.value = true
}

function closeWatchTowerModal() {
  showWatchTowerModal.value = false
  editingTower.value = null
}

function openWaterSourceModal(source?: WaterSource) {
  editingWaterSource.value = source || null
  if (source) {
    waterForm.value = { ...source }
  } else {
    waterForm.value = {
      name: '',
      type: 'reservoir',
      lng: 116.4074,
      lat: 39.9042,
      capacity: 10000
    }
  }
  showWaterSourceModal.value = true
}

function closeWaterSourceModal() {
  showWaterSourceModal.value = false
  editingWaterSource.value = null
}

function openEquipmentModal(equipment?: Equipment) {
  editingEquipment.value = equipment || null
  if (equipment) {
    equipForm.value = { ...equipment }
  } else {
    equipForm.value = {
      name: '',
      category: '灭火装备',
      quantity: 1,
      unit: '台',
      location: '',
      status: 'normal',
      lastCheckDate: new Date().toISOString().split('T')[0]
    }
  }
  showEquipmentModal.value = true
}

function closeEquipmentModal() {
  showEquipmentModal.value = false
  editingEquipment.value = null
}

function closeTeamModal() {
  showTeamModal.value = false
}

// 保存操作
function saveTeam() {
  if (!teamForm.value.name || !teamForm.value.leader) {
    alert('请填写必要信息')
    return
  }
  
  const team: FireTeam = {
    id: Date.now().toString(),
    name: teamForm.value.name,
    leader: teamForm.value.leader,
    phone: teamForm.value.phone,
    memberCount: teamForm.value.memberCount,
    equipment: [],
    status: 'standby',
    location: teamForm.value.location
  }
  
  store.fireTeams.push(team)
  store.saveToLocalStorage()
  
  closeTeamModal()
  teamForm.value = { name: '', leader: '', phone: '', memberCount: 15, location: '' }
  
  alert('队伍登记成功！')
}

function saveWatchTower() {
  if (!towerForm.value.name) {
    alert('请填写瞭望塔名称')
    return
  }
  
  if (editingTower.value) {
    store.updateWatchTower(editingTower.value.id, towerForm.value)
    alert('瞭望塔更新成功！')
  } else {
    store.addWatchTower(towerForm.value)
    alert('瞭望塔标注成功！')
  }
  
  store.saveToLocalStorage()
  closeWatchTowerModal()
}

function saveWaterSource() {
  if (!waterForm.value.name) {
    alert('请填写水源名称')
    return
  }
  
  if (editingWaterSource.value) {
    store.updateWaterSource(editingWaterSource.value.id, waterForm.value)
    alert('水源地更新成功！')
  } else {
    store.addWaterSource(waterForm.value)
    alert('水源地标注成功！')
  }
  
  store.saveToLocalStorage()
  closeWaterSourceModal()
}

function saveEquipment() {
  if (!equipForm.value.name) {
    alert('请填写装备名称')
    return
  }
  
  if (editingEquipment.value) {
    store.updateEquipment(editingEquipment.value.id, equipForm.value)
    alert('装备更新成功！')
  } else {
    store.addEquipment(equipForm.value)
    alert('装备新增成功！')
  }
  
  store.saveToLocalStorage()
  closeEquipmentModal()
}

function deleteEquipment(id: string) {
  if (confirm('确定要删除该装备吗？')) {
    store.deleteEquipment(id)
    store.saveToLocalStorage()
    alert('删除成功！')
  }
}
</script>
