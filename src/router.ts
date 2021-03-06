import Router from "koa-router";

import project from "./route/project";
import test from "./api";
import msg from "./api/msg";
import manger from "./api/manger";
import log from "./api/log";

import logs from "./route/logs";

const router = new Router();

//对内提供的接口
router.use("/api/project", project);
router.use("/api/logs", logs);
router.use("/api/manger", manger);

//对外提供的接口
router.use("/api_track/test", test);
router.use("/api_track/log", log);
router.use("/api_track", msg);

export default router;
