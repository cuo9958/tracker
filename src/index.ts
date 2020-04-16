import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";
import { sendSuccess, sendError } from "./middleware/resp";
import { IRouterParamContext } from "koa-router";

type IRouterContext = Koa.ParameterizedContext & IRouterParamContext;
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

const test = require("./api/index");
const msg = require("./api/msg");

//对外提供的接口
router.use("/api_track/test", test.routers);
router.use("/api_track", msg.routers);

//对内提供的接口
const project = require("./route/project");
router.use("/api_track/project", project.routers);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || "18630";

app.listen(port, function () {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
