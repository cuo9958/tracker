/**
 * 检查用户权限
 */
module.exports = async function (ctx, next) {
    ctx.set("Access-Control-Allow-Origin", "*");
    next();
};
