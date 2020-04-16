import Router from "koa-router";

import project from "./route/project";
import test from "./api";
import msg from "./api/msg";

const router = new Router();

//对内提供的接口
router.use("/api_track/project", project);

//对外提供的接口
router.use("/api_track/test", test);
router.use("/api_track", msg);

export default router;
