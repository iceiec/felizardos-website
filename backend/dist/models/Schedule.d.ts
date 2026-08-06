import mongoose, { Document } from "mongoose";
import type { ISchedule } from "../types";
export interface ScheduleDocument extends ISchedule, Document {
}
declare const _default: mongoose.Model<ScheduleDocument, {}, {}, {}, mongoose.Document<unknown, {}, ScheduleDocument, {}, {}> & ScheduleDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Schedule.d.ts.map