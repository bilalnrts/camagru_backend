import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "An error occurred while getting users." });
    }
}