import express, {json} from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import {v4 as uuid} from 'uuid'
import bcrypt from 'bcrypt'

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

//codigo
app.post('/sing-in', async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await database.collection('users').findOne({ email }); //para pegar o _id
        if(user && bcrypt.compareSync(password, user.password)){
            console.log(chalk.bold.green('deu certo login'))
            const token = uuid()
            const config = {userId: user._id,
                            token }
            console.log('enviando...\n',config)
            await database.collection('sessions').insertOne(config)
            res.status(201).send(config)
            return
        }} catch (err){ 
        console.log(chalk.bold.red('erro sing-in\n',err))
        res.sendStatus(500)
    }
} )

app.post('/sing-up', async (req, res) => {
    const {name, email, password} = req.body
    const passwordHash = bcrypt.hashSync(password,10)
    const user = {name: name,
                    email: email, 
                    password: passwordHash}
    try{
        await database.collection("users").insertOne(user)
        console.log('Registro Feito e senha criptografada\n',user)
        res.sendStatus(201)
    } catch (err){
        console.log(chalk.bold.red('erro sing-up\n',err))
        res.sendStatus(500)
    }
} )