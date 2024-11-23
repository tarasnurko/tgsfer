import { serve } from '@hono/node-server'
import { webhookCallback } from 'grammy'
import { Hono } from 'hono'
import { bot } from './telegramBot.js'
import { run } from '@grammyjs/runner'

const app = new Hono()

// app.post('/webhook', webhookCallback(bot, 'hono'))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

run(bot);
