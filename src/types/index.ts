export interface WeatherData {
  id: string
  date: string
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
  rainfall: number
  fireRiskLevel: number
}

export interface PatrolRecord {
  id: string
  patrolId: string
  patrolName: string
  startTime: string
  endTime: string
  route: string
  distance: number
  status: 'patrolling' | 'completed' | 'pending'
  findings: string
}

export interface WatchTower {
  id: string
  name: string
  lng: number
  lat: number
  height: number
  range: number
  keeper: string
  phone: string
}

export interface WaterSource {
  id: string
  name: string
  type: 'reservoir' | 'river' | 'well' | 'pond'
  lng: number
  lat: number
  capacity: number
}

export interface FirePoint {
  id: string
  reportTime: string
  reporter: string
  location: string
  lng: number
  lat: number
  level: 1 | 2 | 3 | 4 | 5
  status: 'reported' | 'verified' | 'disposing' | 'controlled' | 'extinguished'
  description: string
  spreadDirection: string
  estimatedArea: number
}

export interface SmokePoint {
  id: string
  detectTime: string
  lng: number
  lat: number
  confidence: number
  status: 'suspected' | 'confirmed' | 'false_alarm'
  source: string
}

export interface FireTeam {
  id: string
  name: string
  leader: string
  phone: string
  memberCount: number
  equipment: string[]
  status: 'standby' | 'onmission' | 'rest'
  location: string
}

export interface Equipment {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  location: string
  status: 'normal' | 'damaged' | 'maintenance'
  lastCheckDate: string
}

export interface CallRecord {
  id: string
  time: string
  caller: string
  callerPhone: string
  content: string
  handler: string
}

export interface TimelineEvent {
  id: string
  fireId: string
  time: string
  type: 'report' | 'dispatch' | 'arrival' | 'control' | 'extinguish' | 'other'
  description: string
  operator: string
}

export interface EvacuationPoint {
  id: string
  name: string
  address: string
  lng: number
  lat: number
  capacity: number
  contact: string
  phone: string
}

export interface DrillRecord {
  id: string
  name: string
  date: string
  location: string
  participants: string[]
  duration: number
  result: string
  photos: string[]
}

export interface ReviewReport {
  id: string
  drillId: string
  title: string
  content: string
  problems: string
  suggestions: string
  createTime: string
}

export interface DailyReport {
  id: string
  date: string
  weather: string
  patrolCount: number
  fireRisk: string
  events: string
  dutyOfficer: string
  createTime: string
}

export interface GridCell {
  id: string
  row: number
  col: number
  name: string
  fireRiskLevel: 1 | 2 | 3 | 4 | 5
  vegetation: string
  area: number
  responsiblePerson: string
  phone: string
}
