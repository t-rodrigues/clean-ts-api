export interface AuthenticationDTO {
  email: string;
  password: string;
}

export interface Authentication {
  auth({ email, password }: AuthenticationDTO): Promise<string>;
}
