export interface Sound {
  id: number
  name: string
  sound_file: string
  tag?: string
  tags?: string[]
  category?: number | null
  category_id?: number | null
  category_name?: string | null
  views: number
  is_liked?: boolean
  is_favorited?: boolean
  likes_count: number
  favorites_count: number
  created_at?: string
  updated_at?: string
}

export interface SoundsResponse {
  status: number
  data: {
    count: number
    next: string | null
    previous: string | null
    results: Sound[]
  }
}

export interface SoundResponse {
  status: number
  data: Sound
}
