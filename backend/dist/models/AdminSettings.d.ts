import mongoose, { Document } from "mongoose";
import type { IAdminSettings } from "../types";
export interface AdminSettingsDocument extends IAdminSettings, Document {
}
declare const _default: mongoose.Model<AdminSettingsDocument, {}, {}, {}, mongoose.Document<unknown, {}, AdminSettingsDocument, {}, {}> & AdminSettingsDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=AdminSettings.d.ts.map