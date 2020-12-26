module.exports = function (threadpool) {
    return {
        query: function (sql) {
            console.info(`'${sql}'`)
            return new Promise((res, rej) => {
                threadpool.query(sql, function (error, results, fields) {
                    if (error) {
                        throw error
                    }
                    res(results)
                })
            })
        },
        connection: function (sql) {
            console.info(`'${sql}'`)
            return new Promise((res, rej) => {
                threadpool.getConnection(async function (err, connection) {
                    if (err) throw err;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            throw error
                        };
                        res([results, connection])
                    });
                })
            })
        },
        use_connection: function (connection, sql) {
            console.info(`'${sql}'`)
            return new Promise((res, rej) => {
                connection.query(sql, function (error, results, fields) {
                    if (error) throw error
                    res([results, connection])
                })
            })
        }
    }
}