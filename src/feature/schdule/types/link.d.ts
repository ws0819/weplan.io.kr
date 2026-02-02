export interface Link {
  id?:string
  meetingId: string
  url: string
  title: string
  images:string,
  memo: string | null
  rating: number
  category: string
  latitude: number
  longitude: number
}

export interface LinkCard{
  id?: string,
  meetingId?: string,
  memo: string,
  rating: number,
  category:string,
  title: string,
  url:string
}