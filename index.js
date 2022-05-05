import express, {json} from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

//express 
const app = express()
app.use(cors())
app.use(json())
app.listen(5000, () => {
    console.log(chalk.bold.green('--------------------------\nExpress:UOl online : porta 5000'))
})
//mongo
let database = null
const mongoClient = new MongoClient('mongodb://127.0.0.1:27017')
const promise = mongoClient.connect()
promise.then( () => {
    console.log(chalk.bold.green('Mongo: successful connection\n--------------------------'))
    database = mongoClient.db('MyWallet')
} )
promise.catch(e => console.log(chalk.bold.red('Deu ruim conectar no Mongo',e)))
//dotenv
dotenv.config()

// app.post('/login', async (res, req) => {
//     const loginUSER = req.body
//     try{
//         res.send('aqui ta tudo certo')
//     } catch (err){
//         console.log(chalk.bold.red('erro Get\n',err))
//         res.status(500).send('Deu Ruim')
//     }
// } )

app.post('/register', async (res, req) => {
    const registerUSER = req.body
    try{
        await database.collection("register").insertOne(registerUSER)
        res.send(() => alert('Deu certo aqui boy'))
    } catch (err){
        console.log(chalk.bold.red('erro Get\n',err))
        res.status(500).send('Deu Ruim')
    }
} )