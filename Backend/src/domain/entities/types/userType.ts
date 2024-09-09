export interface IUser {
    name?: string;
    email?: string;
    password?: string;
    favorites?: string[];
    is_verified?: boolean;
    is_google?: boolean;
    is_blocked?:boolean
}

export interface PaginatedUsers {
    users: IUser[];
    totalPages: number;
  }
  