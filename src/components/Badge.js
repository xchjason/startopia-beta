import { useAuth0 } from "@auth0/auth0-react";

export default function Badge() {
  const { user } = useAuth0();
  return (
    <div>
      <span>Logged in as {user.name || "unknown"}</span>
      <span>Email: {user.email || "unknown"}</span>
      <span>Auth0 User ID: {user.sub || "unknown"}</span>
    </div>
  );
}