const uuid = require("uuid")
module.exports = function (threadpool, db) {
    return async function (ctx, next) {
        if (ctx.url.match(/login/) || ctx.url.match(/getCaptcha/)) {
            await next()
            return
        }
        if (!ctx.url.match(/houtai/)) {
            var cookie
            if (cookie = ctx.cookies.get('auth')) {
                const user = (await db.query(`select * from user where cookie = '${cookie}'`))[0];
                if (user) {
                    db.query(`update user set count = ${user.count + 1} where user.id = ${user.id}`);
                    await next()
                    return
                }
            }

            cookie = uuid.v4();
            var location = "china"
            ctx.cookies.set('auth', cookie);
            db.query(`insert into user(cookie, count, location) values('${cookie}', 1, '${location}')`)
            await next()
            return
        }
        else {
            if (!ctx.header.auth || ctx.header.auth != 'liuruige') {
                ctx.body = JSON.stringify({
                    code: 303,
                    data: ''
                })
            }
        }
    }
}