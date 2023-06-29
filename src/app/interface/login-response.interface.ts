export interface LoginResponse {
  status: boolean;
  data: { token: ''; user: any; expires: any };
  message: string;
}
