
const adminRouter = require('./admin')


function route(app) {
    app.use('/', adminRouter)
    
}

module.exports = route;