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

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('forest-fire-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        weatherData.value = data.weatherData || []
        patrolRecords.value = data.patrolRecords || []
        watchTowers.value = data.watchTowers || []
        waterSources.value = data.waterSources || []
        firePoints.value = data.firePoints || []
        smokePoints.value = data.smokePoints || []
        fireTeams.value = data.fireTeams || []
        equipments.value = data.equipments || []
        callRecords.value = data.callRecords || []
        timelineEvents.value = data.timelineEvents || []
        evacuationPoints.value = data.evacuationPoints || []
        drillRecords.value = data.drillRecords || []
        reviewReports.value = data.reviewReports || []
        dailyReports.value = data.dailyReports || []
        gridCells.value = data.gridCells || []
        return true
      } catch {
        return false
      }
    }
    return false
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
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
