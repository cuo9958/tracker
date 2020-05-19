import Koa from "koa";
import KoaBody from "koa-body";
import routers from "./router";

const app = new Koa();

app.use(
    KoaBody({
        // multipart: true,
        // formidable: {
        //     maxFieldsSize: 5 * 1024 * 1024,
        // },
    })
);

//加载路由
app.use(routers.routes()).use(routers.allowedMethods());

const port = process.env.PORT || "18630";

app.listen(port, function () {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
