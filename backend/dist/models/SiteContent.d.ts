import mongoose, { Document } from "mongoose";
import type { ISiteContent } from "../types";
export interface SiteContentDocument extends ISiteContent, Document {
}
declare const _default: mongoose.Model<SiteContentDocument, {}, {}, {}, mongoose.Document<unknown, {}, SiteContentDocument, {}, {}> & SiteContentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=SiteContent.d.ts.map