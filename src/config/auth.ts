// eslint-disable-next-line -- react-query-auth type exports bug
//@ts-ignore
import { configureAuth } from "react-query-auth";

import { API_URLS, apiGet } from "./api";
import { lcStorage } from "./lcStorage";

export interface SignInBodyParams {
  email: string;
  password: string;
}
export interface SignInUser {
  message: string;
}
export type SignInResponse = SignInUser;

export interface User extends SignInUser {
  email: string;
  firstName: string;
  lastName: string;
  customerTag: string;
}

export function getUser() {
  const user = lcStorage.getUser();
  return user ?? null;
}

async function loginFn() {
  const response = await apiGet<SignInResponse>(
    "https://bitter-tuna-61.deno.dev"
  );
  if (!("error" in response)) {
    const user = lcStorage.setUser({ email: "user@test.com" });
    return user;
  }
}

async function logoutFn() {
  await apiGet(API_URLS.auth.logout);
  lcStorage.clearUser();
  window.location.href = "/login";
}

const authConfig = {
  userFn: getUser,
  loginFn,
  logoutFn,
};

export const { useLogin, useLogout, useUser } = configureAuth<
  User,
  Error,
  SignInBodyParams,
  unknown
>(authConfig);
