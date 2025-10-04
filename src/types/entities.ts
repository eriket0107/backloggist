export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  title: string;
  type: 'game' | 'book' | 'serie' | 'movie' | 'course';
  note?: string;
  imgUrl?: string;
  createdAt?: Date;
  updatedAt: Date;
}

export interface UserItem {
  id: string;
  userId: string;
  itemId: string;
  order?: number;
  status?: 'completed' | 'in_progress' | 'pending';
  rating?: number;
  addedAt: Date;
}

export interface UserItemWithDetails {
  id: string;
  userId: string;
  itemId: string;
  order?: number;
  status?: 'completed' | 'in_progress' | 'pending';
  rating?: number;
  addedAt: Date;
  item: Item;
}

export interface Session {
  id: string;
  userId: string;
  accessToken: string;
  isExpired?: boolean;
  expiredAt?: Date;
  createdAt?: Date;
}

export interface BacklogStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export interface Genre {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ItemGenre {
  id: string;
  itemId: string;
  genreId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ItemGenreWithDetails {
  id: string;
  itemId: string;
  genreId: string;
  genre: Genre;
  createdAt?: Date;
  updatedAt: Date;
}
