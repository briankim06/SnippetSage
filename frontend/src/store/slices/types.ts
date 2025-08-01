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
  name: string;
  username: string;
}

export type RootState = {
  auth: {
      token: string | null;
      isLoading: boolean;
      error: string | null;
      user: any | null;
  };
}

export type UserSnippet = {
  _id: string;
  userId: string,
  title: string;
  code: string;
  language?: string;
  framework?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  summary?: string;
}

export type SearchQueryParams = {
  q?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export type CreateSnippetData = {
  title: string;
  code: string;
  tags?: string[];
  language?: string;
  framework?: string;
  summary?: string;
}

export type UpdateSnippetData = {
  id: string;
  title: string;
  code: string;
  language?: string;
  framework?: string;
  tags?: string[];
  summary?: string;
}
