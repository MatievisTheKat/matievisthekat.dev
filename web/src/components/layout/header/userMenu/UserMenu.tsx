import React from "react";

import UserAvatar from "../../../UserAvatar";
import UserLinks from "./Links";

import { getCurrentUser } from "../../../../../util";

interface Props {
  open: boolean;
  setOpen(open?: boolean): void;
}

const UserMenu: React.FC<Props> = ({ open, setOpen }) => {
  const user = getCurrentUser();

  return (
    <div className="ml-3 relative">
      <div>
        <button
          className="user-menu-trigger flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
          aria-label="User menu"
          aria-haspopup="true"
          onClick={() => setOpen()}
        >
          <UserAvatar
            id="user-menu-img"
            className="rounded-full user-menu-trigger"
            width="8"
            src={user ? user.avatar_url : "/avatars/default"}
            border={false}
            alt={`${user ? "User" : "Default"} avatar`}
          />
        </button>
      </div>
      <UserLinks loggedIn={user ? true : false} open={open} />
    </div>
  );
};

export default UserMenu;
