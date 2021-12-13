"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const httpServe = new lib_1.HttpServer({ rootPath: "public" });
httpServe.get("/:id", (req, res) => {
    var _a;
    console.log("test", (_a = req.params) === null || _a === void 0 ? void 0 : _a.id, "HHHHHHHH");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(req.params));
});
httpServe.post("/:id", (req, res) => {
    var _a;
    console.log("test", (_a = req.params) === null || _a === void 0 ? void 0 : _a.id, "postpost");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(req.params));
});
httpServe.start(18888, () => {
    console.log(`Server is running on http://127.0.0.1:${18888}/`);
});
//# sourceMappingURL=index.js.map