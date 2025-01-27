import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  role: string;
}

export function authMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      //   if (!token) {
      //     return res
      //       .status(401)
      //       .json({ message: "Authentication token is missing" });
      //   }

      //   const decoded = jwt.verify(
      //     token,
      //     process.env.JWT_SECRET!
      //   ) as DecodedToken;

      //   // Add the user information to the request object
      //   (req as any).user = decoded;

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}
