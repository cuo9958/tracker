import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";
import { sendSuccess, sendError } from "./middleware/resp";

import project from "./route/project";
import test from "./api";
import msg from "./api/msg";

const app = new Koa();
const router = new Router();

app.use(
    KoaBody({
        // multipart: true,
        // formidable: {
        //     maxFieldsSize: 5 * 1024 * 1024,
        // },
    })
);

app.use(sendSuccess);
app.use(sendError);

//对内提供的接口

router.use("/api_track/project", project);

//对外提供的接口
router.use("/api_track/test", test);
router.use("/api_track", msg);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || "18630";

app.listen(port, function () {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
