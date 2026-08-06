import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    admin?: {
        id: string;
        email: string;
    };
}
export declare function protect(req: AuthRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=authMiddleware.d.ts.map