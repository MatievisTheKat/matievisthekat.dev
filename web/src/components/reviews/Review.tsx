import React, { Suspense } from "react";
import moment from "moment";

import Box from "../Box";

const AdminBadge = React.lazy(() => import("../AdminBadge"));
const UserAvatar = React.lazy(() => import("../UserAvatar"));

import { UserReview } from "../../../types";

const Review: React.FC<UserReview> = ({ admin, avatar_url, created_timestamp, username, body }) => {
  return (
    <Box className="px-16 text-left mb-3">
      <Suspense fallback={null}>
        <UserAvatar src={avatar_url} width={7} border={false} className="inline-block mr-2" />
      </Suspense>
      <h1 className="inline-block mr-3">{username}</h1>
      {admin && (
        <Suspense fallback={null}>
          <AdminBadge className="-ml-2.5 mr-3 -mb-1.5" />
        </Suspense>
      )}
      <span className="text-xs">{moment(new Date(created_timestamp)).fromNow()}</span>
      <hr className="mt-1 w-2/4 ml-8 mb-3 border border-gray-400" />
      <span className="ml-5">{body}</span>
    </Box>
  );
};

export default Review;
