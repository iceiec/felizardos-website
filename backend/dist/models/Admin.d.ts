import mongoose, { Document } from "mongoose";
import type { IAdmin } from "../types";
export interface AdminDocument extends IAdmin, Document {
    comparePassword(candidate: string): Promise<boolean>;
}
declare const _default: mongoose.Model<AdminDocument, {}, {}, {}, mongoose.Document<unknown, {}, AdminDocument, {}, {}> & AdminDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Admin.d.ts.map