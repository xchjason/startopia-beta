import React from "react";

export const NavLogo = () => {
  return (
    <a href="/" className="mx-auto flex items-center gap-2 w-fit">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
      </svg>
      <div className="font-extrabold">
        Startopia
      </div>
    </a>
  );
};
