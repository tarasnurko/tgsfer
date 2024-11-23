import { serve } from '@hono/node-server'
import { webhookCallback } from 'grammy'
import { Hono } from 'hono'
import { bot } from './telegramBot.js'
import { run } from '@grammyjs/runner'
import { cors } from 'hono/cors'
import { setupUserWalletArgs } from './db/repository.js'

const app = new Hono()
app.use('/*', cors())

// app.post('/webhook', webhookCallback(bot, 'hono'))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// app.patch('/update-user', async (c) => {
//   console.log(await c.req.json())
//   return c.json({})
// })

app.post('/setup-wallet', async (c) => {
  const body = await c.req.json()

  const res = setupUserWalletArgs(body)

  return c.json(res)
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

run(bot);
