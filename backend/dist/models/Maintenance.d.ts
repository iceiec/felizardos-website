import mongoose, { Document } from "mongoose";
import type { IMaintenanceItem } from "../types";
export interface MaintenanceDocument extends IMaintenanceItem, Document {
}
declare const _default: mongoose.Model<MaintenanceDocument, {}, {}, {}, mongoose.Document<unknown, {}, MaintenanceDocument, {}, {}> & MaintenanceDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Maintenance.d.ts.map