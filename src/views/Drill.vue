<template>
  <div>
    <div class="page-header">
      <div class="page-title">📋 演练复盘</div>
      <div class="flex gap-12">
        <button class="btn btn-default" @click="recordCall">📞 通话纪要</button>
        <button class="btn btn-primary" @click="showDrillModal = true">📝 新建演练</button>
      </div>
    </div>

    <div class="tabs">
      <div class="tab-item" :class="{ active: activeTab === 'drills' }" @click="activeTab = 'drills'">🎯 演练记录</div>
      <div class="tab-item" :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">📊 复盘报告</div>
      <div class="tab-item" :class="{ active: activeTab === 'calls' }" @click="activeTab = 'calls'">📞 通话纪要</div>
    </div>

    <div v-if="activeTab === 'drills'">
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-card-label">本年度演练</div>
          <div class="stat-card-value">{{ store.drillRecords.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">参与队伍</div>
          <div class="stat-card-value success">{{ totalParticipants }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">总时长</div>
          <div class="stat-card-value warning">{{ totalDuration }} 分钟</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">平均评分</div>
          <div class="stat-card-value">优秀</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🎯 演练记录列表</div>
        </div>
        <div style="max-height: 500px; overflow-y: auto;">
          <div v-for="drill in store.drillRecords" :key="drill.id" style="padding: 20px; border-bottom: 1px solid #f0f0f0;">
            <div class="flex-between mb-12">
              <div>
                <h3 style="font-size: 18px; margin-bottom: 8px;">{{ drill.name }}</h3>
                <div style="color: #666;">
                  📅 {{ drill.date }} | 📍 {{ drill.location }} | ⏱️ {{ drill.duration }}分钟
                </div>
              </div>
              <div class="flex gap-8">
                <button class="btn btn-primary btn-sm" @click="selectedDrill = drill">查看详情</button>
                <button class="btn btn-success btn-sm" @click="generateReview(drill)">生成复盘</button>
              </div>
            </div>
            <div style="color: #666; font-size: 13px;">
              参与队伍：{{ drill.participants.join('、') }}
            </div>
            <div style="color: #52c41a; font-size: 13px; margin-top: 8px;">
              演练结果：{{ drill.result }}
            </div>
            <div v-if="drill.photos.length > 0" class="flex gap-8 mt-12">
              <div v-for="(photo, idx) in drill.photos" :key="idx" style="width: 100px; height: 100px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999;">
                📷 照片{{ idx + 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'reviews'">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 复盘报告列表</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>报告标题</th>
              <th>关联演练</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in store.reviewReports" :key="report.id">
              <td><strong>{{ report.title }}</strong></td>
              <td>{{ getDrillName(report.drillId) }}</td>
              <td>{{ report.createTime }}</td>
              <td>
                <div class="flex gap-8">
                  <button class="btn btn-primary btn-sm" @click="selectedReport = report">查看</button>
                  <button class="btn btn-default btn-sm" @click="exportReview(report)">导出</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="selectedReport" class="card">
        <div class="card-header">
          <div class="card-title">📄 {{ selectedReport.title }}</div>
        </div>
        <div class="form-item">
          <label class="form-label">演练总结</label>
          <div style="padding: 12px; background: #fafafa; border-radius: 4px; line-height: 1.8;">
            {{ selectedReport.content }}
          </div>
        </div>
        <div class="form-item">
          <label class="form-label">存在问题</label>
          <div style="padding: 12px; background: #fff1f0; border-radius: 4px; line-height: 1.8; color: #f5222d;">
            {{ selectedReport.problems }}
          </div>
        </div>
        <div class="form-item">
          <label class="form-label">改进建议</label>
          <div style="padding: 12px; background: #f6ffed; border-radius: 4px; line-height: 1.8; color: #52c41a;">
            {{ selectedReport.suggestions }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'calls'">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📞 通话纪要记录</div>
        </div>
        <div style="max-height: 500px; overflow-y: auto;">
          <div v-for="call in store.callRecords.slice().reverse()" :key="call.id" style="padding: 16px; border-bottom: 1px solid #f0f0f0;">
            <div class="flex-between mb-8">
              <strong>{{ call.caller }}</strong>
              <span style="color: #999; font-size: 12px;">{{ call.time }}</span>
            </div>
            <div style="color: #666; margin-bottom: 4px;">📞 {{ call.callerPhone }}</div>
            <div style="background: #fafafa; padding: 12px; border-radius: 4px; margin: 8px 0;">
              {{ call.content }}
            </div>
            <div style="color: #999; font-size: 12px;">处理人：{{ call.handler }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDrillModal" class="modal-overlay" @click.self="showDrillModal = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">📝 新建演练记录</div>
          <button class="modal-close" @click="showDrillModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label class="form-label">演练名称</label>
            <input class="form-input" v-model="newDrill.name" placeholder="请输入演练名称" />
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">演练日期</label>
              <input class="form-input" type="date" v-model="newDrill.date" />
            </div>
            <div class="form-item">
              <label class="form-label">演练地点</label>
              <input class="form-input" v-model="newDrill.location" placeholder="请输入演练地点" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">演练时长(分钟)</label>
              <input class="form-input" type="number" v-model.number="newDrill.duration" />
            </div>
            <div class="form-item">
              <label class="form-label">参与队伍</label>
              <input class="form-input" v-model="participantsInput" placeholder="多个队伍用逗号分隔" />
            </div>
          </div>
          <div class="form-item">
            <label class="form-label">演练结果</label>
            <textarea class="form-textarea" v-model="newDrill.result" placeholder="请输入演练结果"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showDrillModal = false">取消</button>
          <button class="btn btn-primary" @click="saveDrill">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showCallModal" class="modal-overlay" @click.self="showCallModal = false">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">📞 登记通话纪要</div>
          <button class="modal-close" @click="showCallModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">来电方</label>
              <input class="form-input" v-model="newCall.caller" placeholder="请输入来电方" />
            </div>
            <div class="form-item">
              <label class="form-label">联系电话</label>
              <input class="form-input" v-model="newCall.callerPhone" placeholder="请输入联系电话" />
            </div>
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
          <button class="btn btn-primary" @click="saveCall">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from '@/store'
import type { DrillRecord, ReviewReport, CallRecord } from '@/types'
import { exportToExcel, exportToHTML } from '@/utils'

const store = useMainStore()
const activeTab = ref('drills')
const selectedDrill = ref<DrillRecord | null>(null)
const selectedReport = ref<ReviewReport | null>(null)
const showDrillModal = ref(false)
const showCallModal = ref(false)
const participantsInput = ref('')

const newDrill = ref({
  name: '',
  date: '',
  location: '',
  duration: 120,
  result: ''
})

const newCall = ref({
  caller: '',
  callerPhone: '',
  content: '',
  handler: ''
})

const totalParticipants = computed(() => {
  return store.drillRecords.reduce((sum, d) => sum + d.participants.length, 0)
})

const totalDuration = computed(() => {
  return store.drillRecords.reduce((sum, d) => sum + d.duration, 0)
})

function getDrillName(drillId: string) {
  const drill = store.drillRecords.find(d => d.id === drillId)
  return drill?.name || '-'
}

function recordCall() {
  showCallModal.value = true
}

function generateReview(drill: DrillRecord) {
  const report: ReviewReport = {
    id: Date.now().toString(),
    drillId: drill.id,
    title: `${drill.name} - 复盘报告`,
    content: '本次演练按照预定方案进行，各参演队伍反应迅速，配合默契，基本达到了演练目的。通过演练检验了应急预案的可行性，提升了队伍的实战能力。',
    problems: '1. 部分新队员对装备操作不够熟练；2. 通讯设备在部分区域信号不稳定；3. 现场指挥协调还有提升空间。',
    suggestions: '1. 加强新队员的装备操作培训；2. 补充通讯中继设备，改善山区信号覆盖；3. 定期开展指挥协调训练。',
    createTime: new Date().toLocaleString('zh-CN')
  }
  
  store.reviewReports.unshift(report)
  store.saveToLocalStorage()
  
  alert('复盘报告已生成！')
  activeTab.value = 'reviews'
}

function saveDrill() {
  if (!newDrill.value.name || !newDrill.value.date) {
    alert('请填写必要信息')
    return
  }
  
  const drill: DrillRecord = {
    id: Date.now().toString(),
    name: newDrill.value.name,
    date: newDrill.value.date,
    location: newDrill.value.location,
    participants: participantsInput.value.split(',').map(p => p.trim()).filter(p => p),
    duration: newDrill.value.duration,
    result: newDrill.value.result,
    photos: []
  }
  
  store.drillRecords.unshift(drill)
  store.saveToLocalStorage()
  
  showDrillModal.value = false
  newDrill.value = { name: '', date: '', location: '', duration: 120, result: '' }
  participantsInput.value = ''
  
  alert('演练记录已保存！')
}

function saveCall() {
  if (!newCall.value.caller || !newCall.value.content) {
    alert('请填写必要信息')
    return
  }
  
  const call: CallRecord = {
    id: Date.now().toString(),
    time: new Date().toLocaleString('zh-CN'),
    caller: newCall.value.caller,
    callerPhone: newCall.value.callerPhone || '',
    content: newCall.value.content,
    handler: newCall.value.handler || '值班员'
  }
  
  store.callRecords.unshift(call)
  store.saveToLocalStorage()
  
  showCallModal.value = false
  newCall.value = { caller: '', callerPhone: '', content: '', handler: '' }
  
  alert('通话纪要已保存！')
}

function exportReview(report: ReviewReport) {
  const content = `
    <h1>${report.title}</h1>
    <h2 style="text-align: center; color: #666;">关联演练：${getDrillName(report.drillId)}</h2>
    
    <div class="section">
      <h2>一、演练总结</h2>
      <p style="line-height: 1.8;">${report.content.replace(/\n/g, '<br>')}</p>
    </div>
    
    <div class="section">
      <h2>二、存在问题</h2>
      <p style="line-height: 1.8; color: #f5222d;">${report.problems.replace(/\n/g, '<br>')}</p>
    </div>
    
    <div class="section">
      <h2>三、改进建议</h2>
      <p style="line-height: 1.8; color: #52c41a;">${report.suggestions.replace(/\n/g, '<br>')}</p>
    </div>
    
    <div style="text-align: right; margin-top: 40px;">
      <p>生成时间：${report.createTime}</p>
    </div>
  `
  
  exportToHTML(report.title, content, `${report.title}.html`)
  alert('复盘报告已导出为 HTML 文件，可用浏览器打开或打印为PDF！')
}
</script>
