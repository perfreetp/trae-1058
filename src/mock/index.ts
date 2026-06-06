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

export function generateMockData() {
  const weatherData: WeatherData[] = Array.from({ length: 30 }, (_, i) => ({
    id: `w-${i}`,
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    temperature: Math.round(15 + Math.random() * 20),
    humidity: Math.round(30 + Math.random() * 50),
    windSpeed: Math.round(1 + Math.random() * 8),
    windDirection: ['北', '东北', '东', '东南', '南', '西南', '西', '西北'][Math.floor(Math.random() * 8)],
    rainfall: Math.round(Math.random() * 20 * 10) / 10,
    fireRiskLevel: Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5
  }))

  const patrolRecords: PatrolRecord[] = [
    { id: 'p-1', patrolId: 'XH20240101', patrolName: '东线巡护一组', startTime: '2024-01-15 08:00', endTime: '2024-01-15 12:00', route: 'A区-1号路线', distance: 12.5, status: 'completed', findings: '无异常' },
    { id: 'p-2', patrolId: 'XH20240102', patrolName: '西线巡护二组', startTime: '2024-01-15 08:30', endTime: '2024-01-15 13:00', route: 'B区-2号路线', distance: 15.2, status: 'completed', findings: '发现一处枯木' },
    { id: 'p-3', patrolId: 'XH20240103', patrolName: '南线巡护三组', startTime: '2024-01-15 09:00', endTime: '', route: 'C区-3号路线', distance: 8.0, status: 'patrolling', findings: '' }
  ]

  const watchTowers: WatchTower[] = [
    { id: 'wt-1', name: '主峰瞭望塔', lng: 116.4074, lat: 39.9042, height: 25, range: 15, keeper: '张三', phone: '138****1234' },
    { id: 'wt-2', name: '东山瞭望塔', lng: 116.4574, lat: 39.9242, height: 20, range: 12, keeper: '李四', phone: '139****5678' },
    { id: 'wt-3', name: '西山瞭望塔', lng: 116.3574, lat: 39.8842, height: 22, range: 14, keeper: '王五', phone: '137****9012' }
  ]

  const waterSources: WaterSource[] = [
    { id: 'ws-1', name: '东风水库', type: 'reservoir', lng: 116.4274, lat: 39.9142, capacity: 50000 },
    { id: 'ws-2', name: '清溪河', type: 'river', lng: 116.3874, lat: 39.8942, capacity: 20000 },
    { id: 'ws-3', name: '1号蓄水池', type: 'pond', lng: 116.4174, lat: 39.8742, capacity: 5000 }
  ]

  const firePoints: FirePoint[] = [
    { id: 'f-1', reportTime: '2024-01-15 10:30', reporter: '瞭望塔张三', location: 'A区3号网格', lng: 116.41, lat: 39.90, level: 2, status: 'extinguished', description: '村民烧荒引发，已扑灭', spreadDirection: '东北', estimatedArea: 0.5 },
    { id: 'f-2', reportTime: '2024-01-15 14:20', reporter: '巡护员李四', location: 'B区7号网格', lng: 116.44, lat: 39.92, level: 3, status: 'controlled', description: '雷击引发，正在处置', spreadDirection: '西南', estimatedArea: 2.0 }
  ]

  const smokePoints: SmokePoint[] = [
    { id: 's-1', detectTime: '2024-01-15 15:00', lng: 116.39, lat: 39.88, confidence: 0.85, status: 'confirmed', source: '卫星监测' },
    { id: 's-2', detectTime: '2024-01-15 15:30', lng: 116.43, lat: 39.91, confidence: 0.62, status: 'suspected', source: '视频监控' }
  ]

  const fireTeams: FireTeam[] = [
    { id: 'ft-1', name: '县专业扑火一队', leader: '赵大队长', phone: '138****1111', memberCount: 25, equipment: ['风力灭火机', '水枪', '铁锹'], status: 'standby', location: '县防火办' },
    { id: 'ft-2', name: '县专业扑火二队', leader: '钱副队长', phone: '139****2222', memberCount: 22, equipment: ['风力灭火机', '水枪', '灭火器'], status: 'onmission', location: 'B区火场' },
    { id: 'ft-3', name: '乡镇半专业队', leader: '孙队长', phone: '137****3333', memberCount: 15, equipment: ['铁锹', '扫帚', '灭火弹'], status: 'standby', location: '东山镇政府' }
  ]

  const equipments: Equipment[] = [
    { id: 'e-1', name: '风力灭火机', category: '灭火装备', quantity: 50, unit: '台', location: '中心仓库', status: 'normal', lastCheckDate: '2024-01-10' },
    { id: 'e-2', name: '高压水枪', category: '灭火装备', quantity: 30, unit: '支', location: '中心仓库', status: 'normal', lastCheckDate: '2024-01-10' },
    { id: 'e-3', name: '防火服', category: '防护装备', quantity: 100, unit: '套', location: '中心仓库', status: 'normal', lastCheckDate: '2024-01-08' },
    { id: 'e-4', name: '对讲机', category: '通讯设备', quantity: 80, unit: '部', location: '通讯室', status: 'normal', lastCheckDate: '2024-01-12' },
    { id: 'e-5', name: '无人机', category: '侦查设备', quantity: 5, unit: '架', location: '设备室', status: 'normal', lastCheckDate: '2024-01-05' }
  ]

  const callRecords: CallRecord[] = [
    { id: 'c-1', time: '2024-01-15 08:15', caller: '东山镇', callerPhone: '010-****1001', content: '报告今日巡护安排', handler: '李值班员' },
    { id: 'c-2', time: '2024-01-15 10:32', caller: '主峰瞭望塔', callerPhone: '010-****1002', content: '发现A区有烟点', handler: '王值班员' },
    { id: 'c-3', time: '2024-01-15 14:25', caller: '县气象局', callerPhone: '010-****1003', content: '发布大风蓝色预警', handler: '张值班员' }
  ]

  const timelineEvents: TimelineEvent[] = [
    { id: 't-1', fireId: 'f-2', time: '2024-01-15 14:20', type: 'report', description: '接报B区7号网格发现火情', operator: '李四' },
    { id: 't-2', fireId: 'f-2', time: '2024-01-15 14:25', type: 'dispatch', description: '调派专业扑火二队赶赴现场', operator: '指挥中心' },
    { id: 't-3', fireId: 'f-2', time: '2024-01-15 14:50', type: 'arrival', description: '扑火队伍到达现场', operator: '钱副队长' },
    { id: 't-4', fireId: 'f-2', time: '2024-01-15 15:30', type: 'control', description: '火势得到初步控制', operator: '钱副队长' }
  ]

  const evacuationPoints: EvacuationPoint[] = [
    { id: 'ev-1', name: '东山镇中心小学', address: '东山镇政府路1号', lng: 116.45, lat: 39.93, capacity: 500, contact: '周校长', phone: '138****4444' },
    { id: 'ev-2', name: '西乡镇文化广场', address: '西乡镇文化路8号', lng: 116.33, lat: 39.87, capacity: 300, contact: '吴主任', phone: '139****5555' }
  ]

  const drillRecords: DrillRecord[] = [
    { id: 'd-1', name: '2024年冬季防火演练', date: '2024-01-10', location: 'A区演练场', participants: ['专业扑火一队', '专业扑火二队', '乡镇半专业队'], duration: 180, result: '演练达到预期效果', photos: [] }
  ]

  const reviewReports: ReviewReport[] = [
    { id: 'r-1', drillId: 'd-1', title: '2024年冬季防火演练复盘报告', content: '本次演练模拟了森林火灾的发现、上报、处置、善后全流程。各队伍反应迅速，配合默契，基本达到了演练目的。', problems: '部分新队员操作不够熟练，通讯设备在山区信号不稳定', suggestions: '加强新队员培训，补充通讯中继设备', createTime: '2024-01-11 10:00' }
  ]

  const dailyReports: DailyReport[] = [
    { id: 'dr-1', date: '2024-01-14', weather: '晴，气温2-15℃，北风3-4级', patrolCount: 8, fireRisk: '三级', events: '全天无火情，巡护正常', dutyOfficer: '王主任', createTime: '2024-01-14 17:30' }
  ]

  const gridCells: GridCell[] = []
  const gridNames = ['A', 'B', 'C', 'D', 'E']
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      gridCells.push({
        id: `g-${row}-${col}`,
        row,
        col,
        name: `${gridNames[row]}${col + 1}`,
        fireRiskLevel: Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
        vegetation: ['针叶林', '阔叶林', '针阔混交林', '灌木林'][Math.floor(Math.random() * 4)],
        area: Math.round(500 + Math.random() * 1000),
        responsiblePerson: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
        phone: '138****' + Math.floor(1000 + Math.random() * 9000)
      })
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
    gridCells
  }
}
