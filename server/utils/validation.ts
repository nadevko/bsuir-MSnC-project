export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message);
  }
}

export function validateEmail(email: string): void {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) throw new ValidationError("email", "Email is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new ValidationError("email", "Invalid email format");
  }
}

export function validatePassword(password: string): void {
  if (!password) throw new ValidationError("password", "Password is required");
  if (password.length < 8) {
    throw new ValidationError(
      "password",
      "Password must be at least 8 characters",
    );
  }
}

export function validateUsername(username: string): void {
  const trimmed = username.trim();
  if (!trimmed) throw new ValidationError("username", "Username is required");
  if (trimmed.length < 3) {
    throw new ValidationError(
      "username",
      "Username must be at least 3 characters",
    );
  }
  if (trimmed.length > 50) {
    throw new ValidationError(
      "username",
      "Username must be at most 50 characters",
    );
  }
}

export function validateBirthdate(dateStr: string): Date {
  const trimmed = dateStr.trim();
  if (!trimmed) throw new ValidationError("birthdate", "Birthdate is required");

  const date = new Date(trimmed);
  if (isNaN(date.getTime())) {
    throw new ValidationError("birthdate", "Invalid date format");
  }

  const now = new Date();
  const age = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  if (age < 14)
    throw new ValidationError("birthdate", "You must be at least 14 years old");
  if (age > 120) throw new ValidationError("birthdate", "Invalid birthdate");

  return date;
}

export function validateRegisterForm(body: any) {
  validateUsername(body.username);
  validateEmail(body.email);
  validatePassword(body.password);
  validateBirthdate(body.birthdate);
}

export function validateLoginForm(body: any) {
  validateEmail(body.email);
  validatePassword(body.password);
}
