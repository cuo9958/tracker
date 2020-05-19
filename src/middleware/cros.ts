/**
 * 检查用户权限
 */
export default async function (ctx: any, next: any) {
    ctx.set("Access-Control-Allow-Origin", "*");
    await next();
}
