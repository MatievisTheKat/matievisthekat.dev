import { Router } from "express";
import { User } from "../tables/users";
import { Route } from "../types";
import { Logger } from "../util/Logger";
import { auth } from "../util/middleware";
import ApiResponse from "../util/Response";
import util from "../util/util";

const router = Router();

router.get("/", (req, res) => {
  util
    .getReviews()
    .then((reviews) => new ApiResponse({ status: 200, data: reviews }).send(res))
    .catch(util.handleErr.bind(res));
});

router.post("/create", ...auth(), async (req, res) => {
  const user = req.user as User;
  const { stars, body } = req.body;
  if (!stars || !body) return new ApiResponse({ status: 400, error: "Missing 'stars' or 'body'" }).send(res);

  const alreadyExists = await util.getReview({ uid: user.id }).catch(util.handleErr.bind(res));
  if (alreadyExists) return new ApiResponse({ status: 400, error: "You have already created a review" }).send(res);

  await util
    .createReview(user.id, body, stars)
    .then((review) => new ApiResponse({ status: 201, data: review }).send(res))
    .catch(util.handleErr.bind(res));
});

router.delete("/delete", ...auth(), async (req, res) => {
  const user = req.user as User;
  const { id } = req.query;

  const review = await util.getReview(id && user.admin ? { id: parseInt(id as string) } : { uid: user.id }).catch((err) => Logger.error(err));
  if (!review) return new ApiResponse({ status: 404, error: "No review found" }).send(res);

  if (review.uid !== user.id && !user.admin)
    return new ApiResponse({ status: 403, error: "You are unauthorized to delete another user's review" }).send(res);

  util
    .deleteReview(review.id)
    .then(() => new ApiResponse({ status: 200, message: "Review deleted" }).send(res))
    .catch(util.handleErr.bind(res));
});

router.get("/me", ...auth(), (req, res) => {
  const user = req.user as User;

  util
    .getUserReview({ uid: user.id })
    .then((result) => {
      if (!result) return new ApiResponse({ status: 404, error: "You haven't submitted a review" }).send(res);
      else new ApiResponse({ status: 200, data: result }).send(res);
    })
    .catch(util.handleErr.bind(res));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!id || !parseInt(id)) return new ApiResponse({ status: 400, message: "Invalid 'id' paramater provided" }).send(res);

  util
    .getReview({ id: parseInt(id) })
    .then((review) => new ApiResponse({ status: 200, data: review }).send(res))
    .catch(util.handleErr.bind(res));
});

export const route: Route = {
  path: "/reviews",
  router,
};
