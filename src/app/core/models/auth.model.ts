export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  employeeId: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
