import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Badge() {
  const { user } = useAuth0();
  const saveUser = useMutation(api.users.saveUser);

  useEffect(() => {
    if (user) {
      saveUser({
        name: user.name || "unknown",
        email: user.email || "unknown",
        auth0UserId: user.sub || "unknown",
        saved_ideas: [] // Initialize with an empty array
      });
    }
  }, [user, saveUser]);

  return (
    <div>
      <span>Logged in as {user.name || "unknown"}</span>
      <span>Email: {user.email || "unknown"}</span>
      <span>Auth0 User ID: {user.sub || "unknown"}</span>
    </div>
  );
}