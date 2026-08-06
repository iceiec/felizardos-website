import mongoose, { Document } from "mongoose";
import type { IFacility } from "../types";
export interface FacilityDocument extends Omit<IFacility, "id">, Document {
}
declare const _default: mongoose.Model<FacilityDocument, {}, {}, {}, mongoose.Document<unknown, {}, FacilityDocument, {}, {}> & FacilityDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Facility.d.ts.map