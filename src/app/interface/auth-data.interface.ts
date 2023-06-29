export interface AuthData {
  userId: string;
  userToken: string;
  expiresIn?: string;
}

export interface HasLaunched {
  hasLaunched: boolean;
}

export interface IsOTPEnabled {
  is_enabled: boolean;
}
