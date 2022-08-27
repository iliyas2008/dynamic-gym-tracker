import { useContext } from "react";
import { userAuthContext } from "../context/UserAuthContext";

export function useUserAuth() {
    return useContext(userAuthContext);
}
  