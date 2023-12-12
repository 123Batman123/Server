const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const uuid = require('uuid')
const { koaBody } = require('koa-body')

const app = new Koa()
const router = new Router()
let allTickets =[]
let totalId = 0

app.use(cors())

app.use(koaBody({
    urlencoded: true,
    multipart: true,
  }));

router
    .get('/', async (ctx, next) => {
        const {method, id} = ctx.query
        const date = new Date().getTime()
        if (method === 'allTickets') {
            ctx.body =JSON.stringify( allTickets, null, 4)
        }
        else if (method === 'ticketById') {
            const result = allTickets.find(ticket => ticket.id == id)
            if (!result) {
                ctx.response.status = 404
                ctx.response.body = 'no ticket'
                return
            }
            ctx.body = JSON.stringify(result, null, 4)
        }
        else {
            ctx.response.status = 404
            ctx.response.body = 'GET NOT'
        }
    })

    .post('/', /*koaBody({urlencoded:true, multipart: true}),*/ async (ctx, next) => {
        const {method} = ctx.query
        const {name, description, status} = ctx.request.body

        if (method === 'createTicket') {
            totalId ++
            const ticket = {
                id: totalId,
                name,
                description: description || '',
                status: status || false,
                created: new Date().getTime(),
            }
            allTickets.push(ticket)
            ctx.response.status = 201
            ctx.response.body = ticket
            return
        }
        else {
            ctx.response.status = 404
            ctx.response.body = 'POST NOT'
        }
    })

    .patch('/', async (ctx, next) => {
        const {method, id} = ctx.query
        const {name, description, status} = ctx.request.body
        

        if (method === 'changeTicket') {
            if (allTickets.some(t => t.id == id)) {
                const needIndex = allTickets.findIndex(t => t.id == id)
                console.log(allTickets[needIndex], 'aaa', name, description, status, method, id)
                allTickets[needIndex].name = name || allTickets[needIndex].name
                allTickets[needIndex].description = description || allTickets[needIndex].description
                allTickets[needIndex].status = status || allTickets[needIndex].status

                console.log(allTickets)
                ctx.response.status = 201
                ctx.response.body = allTickets[needIndex]
            }
            else {
                ctx.response.status = 404
                ctx.response.body = "PATCH NO ID"
            }
        }
        else {
            ctx.response.status = 404
            ctx.response.body = "PATCH NO METHOD"
        }
    })

    .delete('/', async (ctx, next) => {
        const {method, id} = ctx.query
        console.log('delete', method, id)
        if (method == 'deleteTicket') {
            if (allTickets.some(t => t.id == id)) {
                allTickets = allTickets.filter(t => t.id != id)
                console.log('delete ticket!!!!!!!!!!!!!!!!!!!',allTickets)
                ctx.response.status = 200
                ctx.response.body = { status: 'ok' }
            }
            else {
                ctx.response.status = 400
                ctx.response.body = "DELETE NO ID"
            }
        }
        else {
            ctx.response.status = 404
            ctx.response.body = "DELETE NO METHOD"
        }
    })



allTickets.push({
    id: uuid.v4(),
    name: '1111',
    description: 0 || '',
    status: 0 || false,
    created: new Date().getTime(),
})

allTickets.push({
    id: uuid.v4(),
    name: '22222',
    description: 0 || '',
    status: 0 || false,
    created: new Date().getTime(),
})


app.use(router.routes())
app.use(router.allowedMethods());

const PORT = process.env.PORT || 7080
app.listen(PORT, () => {
  console.log(`Open http://localhost:${PORT}`)
})
