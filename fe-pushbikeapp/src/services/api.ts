 
import type { UserType } from '@/types/users';
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BE_PUSHBIKEWEB_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = () => api.get<UserType[]>('/user');

export const getUserById = (id_pendaftaran: number) =>
  api.get<UserType>(`/user/${id_pendaftaran}`);

export const createUser = (data: UserType) =>
  api.post('/user', data);

export const updateUser = (id_pendaftaran: number, data: UserType) =>
  api.put(`/user/${id_pendaftaran}`, data);

export const deleteUser = (id_pendaftaran: number) =>
  api.delete(`/user/${id_pendaftaran}`);

console.log("API URL from env:", import.meta.env.VITE_BE_PUSHBIKEWEB_URL);

