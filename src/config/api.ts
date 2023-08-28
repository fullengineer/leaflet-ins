export const API_URLS = {
  auth: {
    login: "auth/login",
    logout: "auth/logout",
  },
  sites: {
    getSites: "sites",
  },
} as const;

export async function handleApiResponse<TResponse>(
  response: Response
): Promise<TResponse> {
  try {
    const data = await response.json();
    if (response.ok) {
      return data as TResponse;
    } else {
      return Promise.reject(data);
    }
  } catch (err) {
    console.error("handleApiResponse error: ", JSON.stringify(err));
    return Promise.reject(err);
  }
}

export async function apiPost<TData, TResponse>(
  url: string,
  data: TData
): Promise<TResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(handleApiResponse<TResponse>);
}

export async function apiPut<TData, TResponse>(
  url: string,
  data: TData
): Promise<TResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(handleApiResponse<TResponse>);
}

export async function apiDelete<TResponse>(url: string): Promise<TResponse> {
  return fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(handleApiResponse<TResponse>);
}

export async function apiGet<TResponse>(url: string): Promise<TResponse> {
  return await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(handleApiResponse<TResponse>);
}
