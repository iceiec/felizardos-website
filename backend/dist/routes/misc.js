"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Facility_1 = __importDefault(require("../models/Facility"));
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
// sitemap.xml — lightweight dynamic sitemap
router.get("/sitemap.xml", async (_req, res) => {
    try {
        const host = (env_1.env.CLIENT_ORIGIN || "").replace(/\/$/, "") || "";
        const facilities = await Facility_1.default.find({}).lean();
        const urls = [
            `${host}/`,
            `${host}/venues/pavilion`,
            `${host}/venues/pool`,
            // include a URL per facility id if available
            ...facilities.filter(f => f.id).map(f => `${host}/venues/${f.id}`),
        ];
        const urlEntries = urls
            .map(u => `  <url>\n    <loc>${u}</loc>\n  </url>`)
            .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
        res.header("Content-Type", "application/xml").send(xml);
    }
    catch (err) {
        res.status(500).send("<?xml version=\"1.0\"?><error>Server error</error>");
    }
});
// robots.txt — points crawlers to the sitemap
router.get("/robots.txt", (_req, res) => {
    const host = (env_1.env.CLIENT_ORIGIN || "").replace(/\/$/, "") || "";
    const sitemapUrl = host ? `${host}/sitemap.xml` : `/sitemap.xml`;
    const lines = [
        "User-agent: *",
        "Allow: /",
        `Sitemap: ${sitemapUrl}`,
        "",
    ];
    res.header("Content-Type", "text/plain").send(lines.join("\n"));
});
exports.default = router;
//# sourceMappingURL=misc.js.map