import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  WeatherData,
  PatrolRecord,
  WatchTower,
  WaterSource,
  FirePoint,
  SmokePoint,
  FireTeam,
  Equipment,
  CallRecord,
  TimelineEvent,
  EvacuationPoint,
  DrillRecord,
  ReviewReport,
  DailyReport,
  GridCell
} from '@/types'
import { generateMockData } from '@/mock'

export const useMainStore = defineStore('main', () => {
  const weatherData = ref<WeatherData[]>([])
  const patrolRecords = ref<PatrolRecord[]>([])
  const watchTowers = ref<WatchTower[]>([])
  const waterSources = ref<WaterSource[]>([])
  const firePoints = ref<FirePoint[]>([])
  const smokePoints = ref<SmokePoint[]>([])
  const fireTeams = ref<FireTeam[]>([])
  const equipments = ref<Equipment[]>([])
  const callRecords = ref<CallRecord[]>([])
  const timelineEvents = ref<TimelineEvent[]>([])
  const evacuationPoints = ref<EvacuationPoint[]>([])
  const drillRecords = ref<DrillRecord[]>([])
  const reviewReports = ref<ReviewReport[]>([])
  const dailyReports = ref<DailyReport[]>([])
  const gridCells = ref<GridCell[]>([])
  const currentDate = ref(new Date().toISOString().split('T')[0])

  function initMockData() {
    const mock = generateMockData()
    weatherData.value = mock.weatherData
    patrolRecords.value = mock.patrolRecords
    watchTowers.value = mock.watchTowers
    waterSources.value = mock.waterSources
    firePoints.value = mock.firePoints
    smokePoints.value = mock.smokePoints
    fireTeams.value = mock.fireTeams
    equipments.value = mock.equipments
    callRecords.value = mock.callRecords
    timelineEvents.value = mock.timelineEvents
    evacuationPoints.value = mock.evacuationPoints
    drillRecords.value = mock.drillRecords
    reviewReports.value = mock.reviewReports
    dailyReports.value = mock.dailyReports
    gridCells.value = mock.gridCells
  }

  function addFirePoint(point: Omit<FirePoint, 'id'>) {
    const newPoint: FirePoint = {
      ...point,
      id: Date.now().toString()
    }
    firePoints.value.push(newPoint)
    return newPoint
  }

  function addTimelineEvent(event: Omit<TimelineEvent, 'id'>) {
    const newEvent: TimelineEvent = {
      ...event,
      id: Date.now().toString()
    }
    timelineEvents.value.push(newEvent)
    return newEvent
  }

  function addPatrolRecord(record: Omit<PatrolRecord, 'id'>) {
    const newRecord: PatrolRecord = {
      ...record,
      id: Date.now().toString()
    }
    patrolRecords.value.push(newRecord)
    return newRecord
  }

  function updateFirePointStatus(id: string, status: FirePoint['status']) {
    const point = firePoints.value.find(p => p.id === id)
    if (point) {
      point.status = status
    }
  }

  function addWeatherData(data: WeatherData[]) {
    weatherData.value = [...weatherData.value, ...data]
  }

  function addWatchTower(tower: Omit<WatchTower, 'id'>) {
    const newTower: WatchTower = {
      ...tower,
      id: Date.now().toString()
    }
    watchTowers.value.push(newTower)
    return newTower
  }

  function updateWatchTower(id: string, tower: Partial<WatchTower>) {
    const idx = watchTowers.value.findIndex(t => t.id === id)
    if (idx > -1) {
      watchTowers.value[idx] = { ...watchTowers.value[idx], ...tower }
    }
  }

  function addWaterSource(source: Omit<WaterSource, 'id'>) {
    const newSource: WaterSource = {
      ...source,
      id: Date.now().toString()
    }
    waterSources.value.push(newSource)
    return newSource
  }

  function updateWaterSource(id: string, source: Partial<WaterSource>) {
    const idx = waterSources.value.findIndex(s => s.id === id)
    if (idx > -1) {
      waterSources.value[idx] = { ...waterSources.value[idx], ...source }
    }
  }

  function addSmokePoint(point: Omit<SmokePoint, 'id'>) {
    const newPoint: SmokePoint = {
      ...point,
      id: Date.now().toString()
    }
    smokePoints.value.push(newPoint)
    return newPoint
  }

  function updateSmokePoint(id: string, point: Partial<SmokePoint>) {
    const idx = smokePoints.value.findIndex(s => s.id === id)
    if (idx > -1) {
      smokePoints.value[idx] = { ...smokePoints.value[idx], ...point }
    }
  }

  function addEquipment(equipment: Omit<Equipment, 'id'>) {
    const newEquip: Equipment = {
      ...equipment,
      id: Date.now().toString()
    }
    equipments.value.push(newEquip)
    return newEquip
  }

  function updateEquipment(id: string, equipment: Partial<Equipment>) {
    const idx = equipments.value.findIndex(e => e.id === id)
    if (idx > -1) {
      equipments.value[idx] = { ...equipments.value[idx], ...equipment }
    }
  }

  function deleteEquipment(id: string) {
    const idx = equipments.value.findIndex(e => e.id === id)
    if (idx > -1) {
      equipments.value.splice(idx, 1)
    }
  }

  function addEvacuationPoint(point: Omit<EvacuationPoint, 'id'>) {
    const newPoint: EvacuationPoint = {
      ...point,
      id: Date.now().toString()
    }
    evacuationPoints.value.push(newPoint)
    return newPoint
  }

  function updateEvacuationPoint(id: string, point: Partial<EvacuationPoint>) {
    const idx = evacuationPoints.value.findIndex(e => e.id === id)
    if (idx > -1) {
      evacuationPoints.value[idx] = { ...evacuationPoints.value[idx], ...point }
    }
  }

  function deleteEvacuationPoint(id: string) {
    const idx = evacuationPoints.value.findIndex(e => e.id === id)
    if (idx > -1) {
      evacuationPoints.value.splice(idx, 1)
    }
  }

  function updateFirePoint(id: string, point: Partial<FirePoint>) {
    const idx = firePoints.value.findIndex(p => p.id === id)
    if (idx > -1) {
      firePoints.value[idx] = { ...firePoints.value[idx], ...point }
    }
  }

  function saveToLocalStorage() {
    const data = {
      weatherData: weatherData.value,
      patrolRecords: patrolRecords.value,
      watchTowers: watchTowers.value,
      waterSources: waterSources.value,
      firePoints: firePoints.value,
      smokePoints: smokePoints.value,
      fireTeams: fireTeams.value,
      equipments: equipments.value,
      callRecords: callRecords.value,
      timelineEvents: timelineEvents.value,
      evacuationPoints: evacuationPoints.value,
      drillRecords: drillRecords.value,
      reviewReports: reviewReports.value,
      dailyReports: dailyReports.value,
      gridCells: gridCells.value
    }
    localStorage.setItem('forest-fire-data', JSON.stringify(data))
  }

  function safeLoad<T>(data: any, key: string, fallback: T): T {
    try {
      const value = data[key]
      if (Array.isArray(value)) {
        return value as T
      }
      return fallback
    } catch {
      return fallback
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('forest-fire-data')
      if (!saved) return false
      
      const data = JSON.parse(saved)
      if (!data || typeof data !== 'object') return false
      
      weatherData.value = safeLoad(data, 'weatherData', [])
      patrolRecords.value = safeLoad(data, 'patrolRecords', [])
      watchTowers.value = safeLoad(data, 'watchTowers', [])
      waterSources.value = safeLoad(data, 'waterSources', [])
      firePoints.value = safeLoad(data, 'firePoints', [])
      smokePoints.value = safeLoad(data, 'smokePoints', [])
      fireTeams.value = safeLoad(data, 'fireTeams', [])
      equipments.value = safeLoad(data, 'equipments', [])
      callRecords.value = safeLoad(data, 'callRecords', [])
      timelineEvents.value = safeLoad(data, 'timelineEvents', [])
      evacuationPoints.value = safeLoad(data, 'evacuationPoints', [])
      drillRecords.value = safeLoad(data, 'drillRecords', [])
      reviewReports.value = safeLoad(data, 'reviewReports', [])
      dailyReports.value = safeLoad(data, 'dailyReports', [])
      gridCells.value = safeLoad(data, 'gridCells', [])
      
      return true
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
      return false
    }
  }

  return {
    weatherData,
    patrolRecords,
    watchTowers,
    waterSources,
    firePoints,
    smokePoints,
    fireTeams,
    equipments,
    callRecords,
    timelineEvents,
    evacuationPoints,
    drillRecords,
    reviewReports,
    dailyReports,
    gridCells,
    currentDate,
    initMockData,
    addFirePoint,
    addTimelineEvent,
    addPatrolRecord,
    updateFirePointStatus,
    addWeatherData,
    addWatchTower,
    updateWatchTower,
    addWaterSource,
    updateWaterSource,
    addSmokePoint,
    updateSmokePoint,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addEvacuationPoint,
    updateEvacuationPoint,
    deleteEvacuationPoint,
    updateFirePoint,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
