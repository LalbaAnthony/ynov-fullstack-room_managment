export const mockUsers = [
  {
    email: "admin@test.com",
    password: "admin123",
    token: "jwt-admin",
    firstName: "Alice",
    lastName: "Admin",
    isAdmin: true,
    isFirstConnection: false,
  },
  {
    email: "user@test.com",
    password: "user123",
    token: "jwt-user",
    firstName: "Bob",
    lastName: "User",
    isAdmin: false,
    isFirstConnection: false,
  },
  {
    email: "first@test.com",
    password: "first123",
    token: "jwt-first",
    firstName: "Claire",
    lastName: "First",
    isAdmin: false,
    isFirstConnection: true,
  },
]
