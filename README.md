# Motivation
When 2 average users transfer funds to each other they need to leave their conversation app and go to metamask or other app to transfer those funds. But what if this "logic" becomes more complex? What if...
- user need to transfer user funds not earlier than tomorrow
- what if Alice need those money tomorow but Bob is to busy in that day?
- waht if Bob dont want to spend his native tokens to make transfer as Alice need those ERC20?
- what if Bob dont want to publicly show how much Alice needs?
- what if ENOUGH🤯

what if you can do it in one place? And I bet YOU can.

Presenting you 🥁🥁🥁 **Tgsfer** (From Telegram + Transfer for dummies)

# What is Tgsfer

It system that allows you to manage all transfer in Telegram. 
You need to transfer tokens to ots of people and you don't want them to find out how much funds you transfered to other people? No worries. Just deposit funds to Vault and generate signatures for other people to withdraw specified amount of funds. All that is possible by using z1slad FHEMV and Telegram abilities.

# Components

[Vault](/contracts/contracts/Vault.sol) (smart-contract):
- Responsible for storing depositor funds. Depositor can at any moment withdraw their funds without any obligations (your funds - do what you want with them).
- To make withdrawal trnsaction executor must provide signature with specified amount to withdraw. Without valid sugnature withdrawal is not possible.
- In case user want to cancel signature depositor can blacklist salt that was used to create signature. That's why `Vault.withdraw()` as one of it's parameters have salt.
- All funds in vault are encrypted using FHEVM (on z1labs) 


Backend
Where to store all this signed data as of course user dould not store it. - backend.
- Responsigble for storing and retrieving all signed messages
- Responsible for telegram bot operations

In general all in `/server` is used to manage depositors signatures (create/update/delete, send to recepient, register in system etc.) 
To be in better context in context look at [tables](/server/src/db/schema.ts), [bot](/server/src/telegramBot.ts) and [repository](/server/src/db/repository.ts). [Entry point with all http endpoints](/server/src/index.ts)

Client
There is 2 clients - telegram bot and telegram mini app. Telegram mini app is needed because depositor need to sign message to allow recepients withdraw funds. But we would still talk about those clients as one whole.
- /start Telegram bot -> mini app - register user in system by saving in db user data (mainly telegram userId and walletAddress)
- ~~/update-profile -> because username, first name and last name can be changed at any time, this can be used to update it on backend~~
- /list - list of signed messages

# Diagram

[Diagram](./Diagram.png)

## Contract Deployment
Vault address: 0x6B173c94002eB298870A313f44F3865B97b3792f
http://46.101.206.70/address/0x6B173c94002eB298870A313f44F3865B97b3792f

Can not verify contract. Tried json and contracts multipart but both loaded indefinitely.

# Guide for user



