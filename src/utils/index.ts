import * as XLSX from 'xlsx'
import type { WeatherData, PatrolRecord } from '@/types'

export function readExcelFile<T = any>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)
        resolve(jsonData as T[])
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsBinaryString(file)
  })
}

export function readCSVFile<T = any>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length < 2) {
          resolve([])
          return
        }
        
        const headers = lines[0].split(',').map(h => h.trim())
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim())
          const obj: Record<string, any> = {}
          headers.forEach((header, idx) => {
            obj[header] = values[idx] || ''
          })
          return obj
        })
        
        resolve(data as T[])
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file, 'UTF-8')
  })
}

export async function importWeatherData(file: File): Promise<WeatherData[]> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  let rawData: any[] = []
  
  if (ext === 'xlsx' || ext === 'xls') {
    rawData = await readExcelFile(file)
  } else if (ext === 'csv') {
    rawData = await readCSVFile(file)
  } else {
    throw new Error('不支持的文件格式，请上传 Excel 或 CSV 文件')
  }
  
  const weatherData: WeatherData[] = rawData.map((row: any, idx: number) => ({
    id: `import-${Date.now()}-${idx}`,
    date: row['日期'] || row['date'] || row[0] || new Date().toISOString().split('T')[0],
    temperature: parseFloat(row['气温'] || row['temperature'] || row[1] || 0),
    humidity: parseFloat(row['湿度'] || row['humidity'] || row[2] || 0),
    windSpeed: parseFloat(row['风速'] || row['windSpeed'] || row[3] || 0),
    windDirection: row['风向'] || row['windDirection'] || row[4] || '北',
    rainfall: parseFloat(row['降雨'] || row['rainfall'] || row[5] || 0),
    fireRiskLevel: parseInt(row['火险等级'] || row['fireRiskLevel'] || row[6] || 0) || 0
  }))
  
  return weatherData
}

export async function importPatrolRecords(file: File): Promise<PatrolRecord[]> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  let rawData: any[] = []
  
  if (ext === 'xlsx' || ext === 'xls') {
    rawData = await readExcelFile(file)
  } else if (ext === 'csv') {
    rawData = await readCSVFile(file)
  } else {
    throw new Error('不支持的文件格式，请上传 Excel 或 CSV 文件')
  }
  
  const patrolRecords: PatrolRecord[] = rawData.map((row: any, idx: number) => ({
    id: `import-${Date.now()}-${idx}`,
    patrolId: row['巡护编号'] || row['patrolId'] || row[0] || `XH${Date.now()}${idx}`,
    patrolName: row['巡护组'] || row['patrolName'] || row[1] || '未命名',
    startTime: row['开始时间'] || row['startTime'] || row[2] || '',
    endTime: row['结束时间'] || row['endTime'] || row[3] || '',
    route: row['路线'] || row['route'] || row[4] || '',
    distance: parseFloat(row['里程'] || row['distance'] || row[5] || 0),
    status: (row['状态'] || row['status'] || row[6] || 'pending') as any,
    findings: row['发现情况'] || row['findings'] || row[7] || ''
  }))
  
  return patrolRecords
}

export function calculateFireRiskLevel(temperature: number, humidity: number, windSpeed: number, rainfall: number): 1 | 2 | 3 | 4 | 5 {
  let score = 0
  
  if (temperature >= 30) score += 20
  else if (temperature >= 25) score += 15
  else if (temperature >= 20) score += 10
  else if (temperature >= 15) score += 5
  
  if (humidity <= 20) score += 25
  else if (humidity <= 30) score += 20
  else if (humidity <= 40) score += 15
  else if (humidity <= 50) score += 10
  else if (humidity <= 60) score += 5
  
  if (windSpeed >= 8) score += 25
  else if (windSpeed >= 6) score += 20
  else if (windSpeed >= 4) score += 15
  else if (windSpeed >= 2) score += 10
  
  if (rainfall <= 0) score += 20
  else if (rainfall <= 1) score += 10
  else if (rainfall <= 5) score += 5
  
  if (score >= 70) return 5
  if (score >= 55) return 4
  if (score >= 40) return 3
  if (score >= 20) return 2
  return 1
}

export async function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1'): Promise<boolean> {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Excel 文件',
          accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
        }]
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return true
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return false
      }
      throw err
    }
  } else {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  }
}

export async function exportToHTML(title: string, content: string, filename: string): Promise<boolean> {
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1890ff; text-align: center; border-bottom: 2px solid #1890ff; padding-bottom: 16px; }
    h2 { color: #333; margin-top: 24px; }
    .section { background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0; }
    .label { font-weight: bold; color: #666; }
    .value { margin-left: 8px; }
    .footer { text-align: right; color: #999; margin-top: 40px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #1890ff; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
  </style>
</head>
<body>
  ${content}
  <div class="footer">
    导出时间：${new Date().toLocaleString('zh-CN')}
  </div>
</body>
</html>`
  
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'HTML 文件',
          accept: { 'text/html': ['.html'] }
        }]
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return true
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return false
      }
      throw err
    }
  } else {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  }
}

export function triggerFileInput(accept: string = '.xlsx,.xls,.csv'): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (file) {
        resolve(file)
      } else {
        reject(new Error('未选择文件'))
      }
    }
    input.onerror = reject
    input.click()
  })
}

export function triggerImageInput(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          resolve(ev.target?.result as string)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      } else {
        reject(new Error('未选择文件'))
      }
    }
    input.onerror = reject
    input.click()
  })
}
