export interface User {
  email: string;
}

const STORAGE_KEY = "TEST_USER";

export const lcStorage = {
  getUser: (): User | null => {
    const user = window.localStorage.getItem(STORAGE_KEY);
    if (user) {
      return JSON.parse(user) as User;
    }
    return null;
  },
  setUser: (user: User) =>
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user)),
  clearUser: () => window.localStorage.removeItem(STORAGE_KEY),
};
