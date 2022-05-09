import chalk from 'chalk'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

let database = null
const mongoClient = new MongoClient(process.env.MYWALLET_URL)
const promise = mongoClient.connect()
promise.then( () => {
    console.log(chalk.bold.green('Mongo: successful connection\n--------------------------'))
    database = mongoClient.db('MyWallet')
} )
promise.catch(e => console.log(chalk.bold.red('Deu ruim conectar no Mongo',e)))

export default database