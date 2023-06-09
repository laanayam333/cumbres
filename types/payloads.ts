export interface Summit {
  peakId: string
  userId: string
  summitDate: string
  summitTime: number
}

export interface Peak {
  id: string
  name: string
  slug: string
  description: string
  elevation: number
  province: string[]
  county: string[]
  range: string[]
  latitude: number
  longitude: number
  highestPoint?: string[]
  imageUrl: string
  userId?: string
  summitId?: string
  summitDate?: any
  summitTime?: number
  summitWeather?: boolean
}

export interface UserPeak {
  id: string
  name: string
  elevation: number
  province: string[]
  county: string[]
  range: string[]
  latitude: number
  longitude: number
  highestPoint?: string[]
  imageUrl: string
  userId?: string
  summitId?: string
  summitDate?: Date
  summitTime?: number
  summitWeather?: boolean
}
