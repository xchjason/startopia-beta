import React from "react";
import { NavLink } from "./NavLink";

// Add to="home" to navigate to the home page
export const NavLinks = () => {
  return (
    <ul className="flex gap-3 text-zinc-400 md:gap-9">
      <li>
        <NavLink to="create">Create</NavLink>
      </li>
      <li>
        <NavLink to="judge">Judge</NavLink>
      </li>
      <li>
        <NavLink to="browse">Browse</NavLink>
      </li>
    </ul>
  );
};
