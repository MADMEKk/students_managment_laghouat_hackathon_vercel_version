import React from "react";
import { useParams } from "react-router";
function userDetails() {
  const { userId } = useParams();
  return <div>user-details</div>;
}

export default userDetails;
