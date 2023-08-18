export const BASE_URL =
  import.meta.env.VITE_SERVER_URL === "dev"
    ? "http://localhost:4000/"
    : "https://veganhive.erikna.com/";
