import { useAuth0 } from "@auth0/auth0-react";
import { SplashButton } from "./buttons/SplashButton"; // Import SplashButton

export default function LogoutButton() {
  const { logout } = useAuth0();
  
  const handleLogout = () => {
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      }
    });
  };

  return (
    <SplashButton onClick={handleLogout}>
      Log out
    </SplashButton>
  );
}