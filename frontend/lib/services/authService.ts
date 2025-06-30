import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  isFirstConnection: boolean;
}

export interface LoginApiResponse {
  message: string;
  token: string;
  user: ApiUser;
}

/**
 * Function to call the backend login endpoint.
 * @param credentials - The user's email and password.
 * @returns The complete API response (token + user information).
 * @throws {Error} If the login fails or the server response is not OK.
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginApiResponse> {
  const apiUrl = "http://localhost:4000/api";

  if (!apiUrl) {
    throw new Error(
      "La variable d'environnement NEXT_PUBLIC_API_URL n'est pas définie."
    );
  }

  const response = await fetch(`${apiUrl}/user/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }));

    throw new Error(errorData.message || "Identifiants invalides.");
  }

  const data: LoginApiResponse = await response.json();
  return data;
}
