import { RESPONSE_SERVER_ERROR } from "../../constants";
import { Response } from "express";
import { withMiddleware } from "../../middleware/withMiddleware";
import { isAuth } from "../../middleware/isAuth";
import { UserCategoryInteractionModel } from "../../models/userCategoryInteraction";
import { AuthUserRequest } from "../../types";

export const generateFeed = withMiddleware(isAuth)(async (req: AuthUserRequest, res: Response) => {
    try {
        const interactons = UserCategoryInteractionModel.find({ user: req.user.userId }).sort({ weight: -1 });
        
    } catch (error) {
        console.log(error);
        return RESPONSE_SERVER_ERROR(res, "An error occurred while generating feed.");
    }
})