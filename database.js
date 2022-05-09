import chalk from 'chalk'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

let database = null
const mongoClient = new MongoClient(process.env.MYWALLET_URL)
try{
     await mongoClient.connect()
     database = mongoClient.db('MyWallet')
        console.log(chalk.bold.green('Mongo: successful connection'))
} catch (e){
    console.log(chalk.bold.red('Deu ruim conectar no Mongo',e))
}

export default database