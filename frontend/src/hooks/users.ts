import { useContext } from "react";
import { UsersContext } from "../contexts/user";

export function useUsers() {
  return useContext(UsersContext);
}
