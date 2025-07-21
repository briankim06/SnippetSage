export type SafeUser = {
    _id: string;
    name: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };

export type LoginResponse = {
    token: string;
    user: SafeUser;
}

export type RegisterResponse = {
    token: string;
    user: SafeUser;
}

export type RefreshTokenResponse = {
  token: string;
}

export type LoginCredentials = {
  email: string;
  password: string;
}

export type RegisterCredentials = {
  email: string;
  password: string;
}

export type RootState = {
  auth: {
      token: string | null;
      isLoading: boolean;
      error: string | null;
      user: any | null;
  };
}