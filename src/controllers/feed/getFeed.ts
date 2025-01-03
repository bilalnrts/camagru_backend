import { RESPONSE_SERVER_ERROR } from "../../constants"
import { isAuth } from "../../middleware/isAuth"
import { withMiddleware } from "../../middleware/withMiddleware"
import { FeedModel } from "../../models/feed"
import { AuthUserRequest } from "../../types"
import { Response } from "express"

export const getFeedAuth = withMiddleware(isAuth)(async (req: AuthUserRequest, res: Response) => {
    try {
        const {userId} = req.user;

       const feeds = await FeedModel.find({
        user: userId,
        status: "active",
       }).populate("post postOwner").limit(20);

       return res.status(200).json(feeds);
    } catch (error) {
        console.log(error);
        return RESPONSE_SERVER_ERROR(res, "An error occurred while fetching feed.");
    }
})