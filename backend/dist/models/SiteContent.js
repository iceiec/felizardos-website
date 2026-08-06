"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Singleton document — always findOne() or findOneAndUpdate().
const SiteContentSchema = new mongoose_1.Schema({
    heroTagline: { type: String, default: "Premium Event Venue · Philippines" },
    heroTitle: { type: String, default: "Where Every Moment Becomes" },
    heroHighlight: { type: String, default: "A Memory" },
    heroSubtitle: {
        type: String,
        default: "Two stunning venues — an elegant Pavilion and a resort-style Swimming Pool — crafted for celebrations that deserve to be remembered.",
    },
    contactAddress: { type: String, default: "Felizardo's Event Place, Batangas, Philippines" },
    contactPhone: { type: String, default: "+63 912 345 6789" },
    contactEmail: { type: String, default: "events@felizardos.com" },
    contactHours: { type: String, default: "Monday – Saturday, 9:00 AM – 6:00 PM" },
    pavilionDescription: {
        type: String,
        default: "An open-air masterpiece embraced by lush greenery and golden natural light. The Pavilion transforms any occasion into an elegant affair — from intimate garden weddings to grand corporate galas — accommodating up to 200 guests in effortless style.",
    },
    poolDescription: {
        type: String,
        default: "Dive into a tropical paradise. Our resort-style swimming pool turns any gathering into a sun-soaked celebration — perfect for pool parties, children's birthdays, team-building retreats, and intimate sundowner events.",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("SiteContent", SiteContentSchema);
//# sourceMappingURL=SiteContent.js.map