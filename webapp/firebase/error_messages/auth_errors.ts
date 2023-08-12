export const errorMessages: { [key: string]: string } = {
  "auth/app-deleted": "The authentication server has been shut down.",
  "auth/argument-error": "An invalid argument was provided.",
  "auth/network-request-failed":
    "A network error occurred. Please check your connection and try again.",
  "auth/too-many-requests":
    "Too many unsuccessful login attempts. Please try again later.",
  "auth/user-disabled":
    "The user account has been disabled by an administrator.",
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email address but different sign-in credentials.",
  "auth/email-already-in-use":
    "The email address is already in use by another account.",
  "auth/invalid-credential": "This credential is malformed or has expired.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/wrong-password":
    "The password is invalid or the user does not have a password.",
  "auth/user-not-found":
    "Email is not registered. Please check your email and try again.",
};
