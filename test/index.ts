import { HttpServer } from "../lib";

const httpServe = new HttpServer({ rootPath: "public" });

httpServe.get("/:id", (req, res) => {
  console.log("test", req.params?.id, "HHHHHHHH");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.params));
});

httpServe.post("/:id", (req, res) => {
  console.log("test", req.params?.id, "postpost");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.params));
});

httpServe.start(18888, () => {
  console.log(`Server is running on http://127.0.0.1:${18888}/`);
});
