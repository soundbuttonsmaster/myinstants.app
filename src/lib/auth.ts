// Authentication utilities
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

export function getUserData(): any | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
}

export function setUserData(user: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user_data', JSON.stringify(user));
}

export function removeUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user_data');
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

export function logout(): void {
  removeAuthToken();
  removeUserData();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

