export const ERROR_CODES = {
  // AUTH
  AUTH_INVALID_CREDENTIALS: {
    status: 401,
    message: "Invalid email or password",
  },

  AUTH_USER_INACTIVE: {
    status: 403,
    message: "User is inactive",
  },

  AUTH_TOKEN_INVALID: {
    status: 401,
    message: "Invalid or expired token",
  },

  INTERNAL_ERROR: {
    status: 500,
    message: "Internal server error",
  },
  AUTH_EMAIL_ALREADY_EXISTS: {
    status: 409,
    message: "Email already exists",
  },

  AUTH_INVALID_INPUT: {
    status: 400,
    message: "Invalid input data",
  },

  INTERNAL_ERROR: {
    status: 500,
    message: "Internal server error",
  },
  

  // USERS
  USERS_ALREADY_EXISTS: {
    status: 409,
    message: "User already exists",
  },

  USERS_INVALID_INPUT: {
    status: 400,
    message: "Invalid user data",
  },

  USERS_NOT_FOUND: {
    status: 404,
    message: "User not found",
  },

  // EMPLOYEES
  EMPLOYEE_INVALID_INPUT: {
    status: 400,
    message: "Invalid employee data",
  },

  EMPLOYEE_NOT_FOUND: {
    status: 404,
    message: "Employee not found",
  },

  // COMPANY
  COMPANY_NOT_FOUND: {
    status: 404,
    message: "Company not found",
  },
  COMPANY_ACCESS_DENIED: {
    status: 403,
    message: "User does not belong to this company",
  },

  // PERMISSIONS
  PERMISSION_DENIED: {
    status: 403,
    message: "Permission denied",
  },

  // INVENTORY
  INVENTORY_INSUFFICIENT_STOCK: {
    status: 400,
    message: "Insufficient stock",
  },

  // GENERIC
  INTERNAL_ERROR: {
    status: 500,
    message: "Internal server error",
  },
};
