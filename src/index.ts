import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";

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

const test = require("./api/index");

router.use("/api_track/test", test.routers);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || "18630";

app.listen(port, function () {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
