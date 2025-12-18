const API_BASE_URL = 'http://play.soundboard.cloud/api/myinstants.app';

export interface Sound {
  id: number;
  name: string;
  sound_file: string;
  tag?: string;
  tags?: string[];
  category?: number;
  category_id?: number;
  category_name?: string;
  views?: number;
  is_liked?: boolean;
  is_favorited?: boolean;
  likes_count?: number;
  favorites_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    return null;
  }
}

export async function fetchNewSounds(limit: number = 40): Promise<Sound[]> {
  const data = await fetchApi<PaginatedResponse<Sound>>(`/sounds/new?page_size=${limit}`);
  if (data && 'results' in data && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}

export async function fetchTrendingSounds(limit: number = 40): Promise<Sound[]> {
  const data = await fetchApi<PaginatedResponse<Sound>>(`/sounds/trending?page_size=${limit}`);
  if (data && 'results' in data && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}

export async function fetchSounds(params: {
  page?: number;
  page_size?: number;
  category?: number;
  tag?: string;
  search?: string;
} = {}): Promise<PaginatedResponse<Sound>> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params.category) queryParams.append('category', params.category.toString());
  if (params.tag) queryParams.append('tag', params.tag);
  if (params.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const data = await fetchApi<PaginatedResponse<Sound>>(`/sounds${queryString ? `?${queryString}` : ''}`);
  
  if (data && 'results' in data) {
    return data;
  }
  
  // Return empty paginated response
  return {
    count: 0,
    next: null,
    previous: null,
    results: []
  };
}

export async function fetchSoundById(id: number): Promise<Sound | null> {
  try {
    const url = `${API_BASE_URL}/sounds/${id}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API error for sound ${id}: ${response.status} ${response.statusText}`);
      return null;
    }

    const responseData: any = await response.json();
    
    // Handle ApiResponse format: { status: 200, data: {...} }
    if (responseData && typeof responseData === 'object' && 'data' in responseData && responseData.data) {
      return responseData.data as Sound;
    }
    
    // Handle direct Sound format: { id: 1, name: "...", ... }
    if (responseData && typeof responseData === 'object' && 'id' in responseData && 'name' in responseData) {
      return responseData as Sound;
    }
    
    console.error(`Unexpected API response format for sound ${id}:`, JSON.stringify(responseData).substring(0, 200));
    return null;
  } catch (error) {
    console.error(`Error fetching sound ${id}:`, error);
    return null;
  }
}

export async function searchSounds(query: string, limit: number = 40): Promise<Sound[]> {
  const data = await fetchApi<PaginatedResponse<Sound>>(`/sounds/search?name=${encodeURIComponent(query)}&page_size=${limit}`);
  if (data && 'results' in data && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}

export interface Category {
  id: number;
  name: string;
  order: number;
  is_active: boolean;
  children: Category[];
  parent?: number | null;
  parent_id?: number | null;
  parent_name?: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  const data = await fetchApi<Category[]>(`/user/categories`);
  if (data && Array.isArray(data)) {
    return data;
  }
  return [];
}

export async function fetchCategoryById(id: number): Promise<Category | null> {
  return await fetchApi<Category>(`/user/categories/${id}`);
}

// User Authentication & Profile
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: number;
  role_name?: string;
  role_code?: string;
  is_active?: boolean;
  is_verified?: boolean;
  date_joined?: string;
  created_at?: string;
  last_login?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
}

async function fetchApiWithAuth<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    return null;
  }
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}): Promise<AuthResponse | null> {
  const response = await fetchApiWithAuth<ApiResponse<AuthResponse>>(
    `/user/register`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  
  if (response && 'data' in response) {
    return response.data;
  }
  return null;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse | null> {
  try {
    const url = `${API_BASE_URL}/user/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.statusText}`);
    }

    const result: ApiResponse<AuthResponse> = await response.json();
    if (result && 'data' in result) {
      return result.data;
    }
    return null;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function getUserProfile(token: string): Promise<User | null> {
  const response = await fetchApiWithAuth<ApiResponse<User>>(
    `/user/profile`,
    {
      method: 'GET',
    },
    token
  );
  
  if (response && 'data' in response) {
    return response.data;
  }
  return null;
}

export async function updateUserProfile(
  token: string,
  data: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }
): Promise<User | null> {
  const response = await fetchApiWithAuth<ApiResponse<{ user: User; message: string }>>(
    `/user/profile`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token
  );
  
  if (response && 'data' in response && 'user' in response.data) {
    return response.data.user;
  }
  return null;
}

export async function fetchUserFavorites(token: string, page: number = 1, pageSize: number = 100): Promise<PaginatedResponse<Sound>> {
  const response = await fetchApiWithAuth<PaginatedResponse<Sound>>(
    `/sounds/user/favorites?page=${page}&page_size=${pageSize}`,
    {
      method: 'GET',
    },
    token
  );
  
  if (response && 'results' in response) {
    return response;
  }
  
  return {
    count: 0,
    next: null,
    previous: null,
    results: []
  };
}

export async function fetchUserUploadedSounds(token: string, page: number = 1, pageSize: number = 100): Promise<PaginatedResponse<Sound>> {
  const response = await fetchApiWithAuth<PaginatedResponse<Sound>>(
    `/sounds/user/uploaded?page=${page}&page_size=${pageSize}`,
    {
      method: 'GET',
    },
    token
  );
  
  if (response && 'results' in response) {
    return response;
  }
  
  return {
    count: 0,
    next: null,
    previous: null,
    results: []
  };
}

export async function uploadSound(
  token: string,
  formData: FormData
): Promise<Sound | null> {
  try {
    const url = `${API_BASE_URL}/sounds`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: ApiResponse<Sound> = await response.json();
    if (data && 'data' in data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

