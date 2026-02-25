const API_BASE_URL = 'https://play.soundboard.cloud/api/memesoundboard.org'

export interface ApiResponse<T> {
  status: number
  data: T
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      let errMsg = `API request failed: ${response.status} ${response.statusText}`
      try {
        const errBody = await response.json().catch(() => null) as Record<string, unknown> | null
        const msg = errBody?.message ?? errBody?.error ?? errBody?.detail
        if (typeof msg === "string") errMsg = msg
        else if (Array.isArray(msg)) errMsg = (msg as string[]).join(", ")
      } catch { /* ignore */ }
      throw new Error(errMsg)
    }

    const data = await response.json()
    
    // Handle both response formats:
    // 1. Direct response: { count, next, previous, results }
    // 2. Wrapped response: { status, data: { count, next, previous, results } }
    if (data.status && data.data) {
      // Wrapped format
      return data as ApiResponse<T>
    } else {
      // Direct format - wrap it
      return {
        status: response.status,
        data: data as T
      }
    }
  }

  // Sounds endpoints
  async getSounds(params?: {
    category?: number
    tag?: string
    search?: string
    page?: number
    page_size?: number
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category.toString())
    if (params?.tag) queryParams.append('tag', params.tag)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString())

    const query = queryParams.toString()
    return this.request(`/sounds${query ? `?${query}` : ''}`)
  }

  async getTrendingSounds(page: number = 1, pageSize: number = 40): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request(`/sounds/trending?page=${page}&page_size=${pageSize}`)
  }

  async getNewSounds(page: number = 1, pageSize: number = 40): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request(`/sounds/new?page=${page}&page_size=${pageSize}`)
  }

  async getSoundById(id: number): Promise<ApiResponse<any>> {
    return this.request(`/sounds/${id}`)
  }

  async searchSounds(name: string, page: number = 1, pageSize: number = 40): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request(`/sounds/search?name=${encodeURIComponent(name)}&page=${page}&page_size=${pageSize}`)
  }

  async getRelatedSounds(id: number, limit: number = 10, page: number = 1, pageSize: number = 20): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request(`/sounds/${id}/related?limit=${limit}&page=${page}&page_size=${pageSize}`)
  }

  async updateViews(soundId: number): Promise<ApiResponse<any>> {
    return this.request('/sounds/views', {
      method: 'POST',
      body: JSON.stringify({ sound_id: soundId }),
    })
  }

  /** URL for streaming/playback (e.g. in <audio>). */
  getSoundAudioUrl(id: number): string {
    return `${this.baseUrl}/sounds/${id}/audio`
  }

  /** URL for download. Use ?download=true so API/S3 can set Content-Disposition: attachment for proper file download. */
  getSoundDownloadUrl(id: number): string {
    return `${this.baseUrl}/sounds/${id}/audio?download=true`
  }

  // Categories endpoints
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request('/user/categories')
  }

  async getCategoryById(id: number): Promise<ApiResponse<any>> {
    return this.request(`/user/categories/${id}`)
  }

  // User endpoints (require authentication)
  async register(data: { username: string; email: string; password: string; full_name?: string }): Promise<ApiResponse<any>> {
    return this.request('/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(email: string, password: string): Promise<ApiResponse<any>> {
    return this.request('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/user/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(uid: string, token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/user/reset-password', {
      method: 'POST',
      body: JSON.stringify({ uid, token, password }),
    })
  }

  async getUserProfile(token: string): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
  }

  async updateUserProfile(token: string, data: { first_name?: string; last_name?: string; phone_number?: string }): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    })
  }

  async getUserFavorites(token: string, page: number = 1, pageSize: number = 40): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request(`/sounds/user/favorites?page=${page}&page_size=${pageSize}`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
  }

  async getUserLikes(token: string, page: number = 1, pageSize: number = 40): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.request(`/sounds/user/likes?page=${page}&page_size=${pageSize}`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
  }

  async getUserUploadedSounds(token: string, userId?: number, page: number = 1, pageSize: number = 40): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (userId) queryParams.append('user_id', userId.toString())
    queryParams.append('page', page.toString())
    queryParams.append('page_size', pageSize.toString())
    return this.request(`/sounds/user/uploaded?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
  }

  async likeSound(token: string, soundId: number): Promise<ApiResponse<any>> {
    return this.request(`/sounds/${soundId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
  }

  async unlikeSound(token: string, soundId: number): Promise<ApiResponse<any>> {
    return this.request(`/sounds/${soundId}/like`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
  }

  async favoriteSound(token: string, soundId: number): Promise<ApiResponse<any>> {
    return this.request(`/sounds/${soundId}/favorite`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
  }

  async unfavoriteSound(token: string, soundId: number): Promise<ApiResponse<any>> {
    return this.request(`/sounds/${soundId}/favorite`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
  }

  // Blog endpoints
  async getBlogs(search?: string, page: number = 1, pageSize: number = 20): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    queryParams.append('page', page.toString())
    queryParams.append('page_size', pageSize.toString())
    return this.request(`/user/blogs?${queryParams.toString()}`)
  }

  async getBlogById(id: number): Promise<ApiResponse<any>> {
    return this.request(`/user/blogs/${id}`)
  }

  /** URL for blog featured image (no auth required per API doc) */
  getBlogImageUrl(id: number): string {
    return `${this.baseUrl}/user/blogs/${id}/image`
  }

  /** Upload a new sound (auth required). Use sound_file (File) or sound_file_url (string). */
  async uploadSound(
    token: string,
    data: { name: string; sound_file?: File; sound_file_url?: string; tag?: string; category?: number }
  ): Promise<ApiResponse<any>> {
    const url = `${this.baseUrl}/sounds`
    const body = new FormData()
    body.append('name', data.name)
    if (data.sound_file) body.append('sound_file', data.sound_file)
    if (data.sound_file_url) body.append('sound_file_url', data.sound_file_url)
    if (data.tag) body.append('tag', data.tag)
    if (data.category != null) body.append('category', String(data.category))
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Token ${token}` },
      body,
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`)
    const json = await response.json()
    if (json.status != null && json.data != null) return json as ApiResponse<any>
    return { status: response.status, data: json }
  }
}

export const apiClient = new ApiClient()
