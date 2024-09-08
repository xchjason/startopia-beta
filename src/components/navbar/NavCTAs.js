import React from "react";
import { SplashButton } from "../buttons/SplashButton";
import { useAuth0 } from "@auth0/auth0-react";

export const NavCTAs = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex items-center gap-2">
      <SplashButton
        onClick={loginWithRedirect}
        className="rounded-md px-4 py-1 text-base text-zinc-100"
      >
        Log in
      </SplashButton>
    </div>
  );
};