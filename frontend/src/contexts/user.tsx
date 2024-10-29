import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
} from "react";
import { CreateUserDto, UpdateUserDto, User } from "../interfaces/user";
import { useCallback, useEffect, useState } from "react";
import queryString from "query-string";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/users`;
const FILE_URL = `${API_URL}/file`;
const DEFAULT_ROWS_PER_PAGE = 10;

interface IUsersContext {
  count: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  users: User[];
  getUsers: () => Promise<void>;
  getRandomUserData: () => void;
  createUser: (createUserDto: CreateUserDto) => Promise<void>;
  updateUser: (userId: number, updateUserDto: UpdateUserDto) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  getUsersLoading: boolean;
  getRandomUserLoading: boolean;
  createOrUpdateUserLoading: boolean;
  deleteUserLoading: boolean;
  user: Omit<Partial<User>, "id"> | undefined;
  setUser: Dispatch<SetStateAction<Omit<Partial<User>, "id"> | undefined>>;
  uploadAvatar: (file: File) => Promise<string | undefined>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UsersContext = createContext({} as IUsersContext);

export default function UsersContextProvider({ children }: PropsWithChildren) {
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [error, setError] = useState("");
  const [getUsersLoading, setGetUsersLoading] = useState(false);
  const [getRandomUserLoading, setGetRandomUserLoading] = useState(false);
  const [createOrUpdateUserLoading, setCreateOrUpdateUserLoading] =
    useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [user, setUser] = useState<Omit<Partial<User>, "id"> | undefined>();
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = useCallback(async () => {
    setGetUsersLoading(true);
    try {
      const query = queryString.stringify({
        skip: page * rowsPerPage,
        take: rowsPerPage,
        search,
      });
      const response = await fetch(`${BASE_URL}?${query}`);
      if (!response.ok) {
        throw new Error(
          "Houve um problema ao buscar pelos usuários cadastrados!"
        );
      }
      const { result: users, count } = await response.json();
      setUsers(users);
      setCount(count);
    } catch (e) {
      const msg = (e as { message: string }).message;
      setError(msg);
    }
    setGetUsersLoading(false);
  }, [page, rowsPerPage, search]);
  const getRandomUserData = useCallback(async () => {
    setGetRandomUserLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/random`);
      if (!response.ok) {
        throw new Error("Houve um problema ao gerar um usuário aleatório!");
      }
      const randomUser = await response.json();
      setUser(randomUser);
    } catch (e) {
      const msg = (e as { message: string }).message;
      setError(msg);
    }
    setGetRandomUserLoading(false);
  }, []);
  const createUser = useCallback(async (createUserDto: CreateUserDto) => {
    setCreateOrUpdateUserLoading(true);
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(createUserDto),
      });
      if (!response.ok) {
        throw new Error("Houve um problema ao criar o usuário!");
      }
    } catch (e) {
      const msg = (e as { message: string }).message;
      setError(msg);
    }
    setCreateOrUpdateUserLoading(false);
  }, []);
  const updateUser = useCallback(
    async (userId: number, updateUserDto: UpdateUserDto) => {
      setCreateOrUpdateUserLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/${userId}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updateUserDto),
        });
        if (!response.ok) {
          throw new Error("Houve um problema ao editar o usuário!");
        }
      } catch (e) {
        const msg = (e as { message: string }).message;
        setError(msg);
      }
      setCreateOrUpdateUserLoading(false);
    },
    []
  );
  const deleteUser = useCallback(async (userId: number) => {
    setDeleteUserLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Houve um problema ao excluir o usuário!");
      }
    } catch (e) {
      const msg = (e as { message: string }).message;
      setError(msg);
    }
    setDeleteUserLoading(false);
  }, []);
  const mountAvatarUrl = useCallback((avatarUrl: string) => {
    return `${API_URL}/uploads/${avatarUrl}`;
  }, []);
  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await fetch(`${FILE_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        if (!result.ok) {
          throw new Error("Erro ao fazer upload de avatar!");
        }
        const avatarUrl = await result.text();
        return mountAvatarUrl(avatarUrl);
      } catch (e) {
        const msg = (e as { message: string }).message;
        setError(msg);
      }
    },
    [mountAvatarUrl]
  );

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <UsersContext.Provider
      value={{
        count,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        error,
        setError,
        users,
        getUsers,
        getRandomUserData,
        createUser,
        updateUser,
        deleteUser,
        getUsersLoading,
        getRandomUserLoading,
        createOrUpdateUserLoading,
        deleteUserLoading,
        user,
        setUser,
        uploadAvatar,
        search,
        setSearch,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
