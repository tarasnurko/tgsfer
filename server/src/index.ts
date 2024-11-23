import { serve } from '@hono/node-server'
import { webhookCallback } from 'grammy'
import { Hono } from 'hono'
import { bot } from './telegramBot.js'
import { run } from '@grammyjs/runner'
import { cors } from 'hono/cors'
import { createSignedWithdrawal, deleteSignedMessage, findProfileById, setupUserWalletArgs } from './db/repository.js'

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

  const res = await setupUserWalletArgs(body)

  const profile = await findProfileById(body.id)

  if (!profile) {
    return c.json(res)
  }

  await bot.api.sendMessage(profile.chatId, `You connected walles successfully. Your wallet address is: ${body.walletAddress}`)

  return c.json(res)
})

app.post('/withdrawals', async (c) => {
  const body = await c.req.json()

  const res = await createSignedWithdrawal(body)

  const profile = await findProfileById(body.id)

  if (!profile) {
    return c.json(res)
  }

  await bot.api.sendMessage(profile.chatId, `New signature was successfully created. To get all signatures type /signatures`)

  return c.json(res)
})

app.delete('/withdrawals', async (c) => {
  const body = await c.req.json()

  await deleteSignedMessage(body.id);
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

run(bot);
