import { Navigate } from "../../../../routing/index";

/**
 * redirect to login page after logout
 */
export default function Logout() {
  return <Navigate href="/login" />;
}
