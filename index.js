import express, {json} from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import dayjs from 'dayjs'
import joi from 'joi'
import { getTransference, postEntry, postLogout, postOutput, postSingIn, postSingUp } from './controllers/userController.js'

//mongo
import database from './database.js'

//express 
const app = express()
app.use(cors())
app.use(json())
app.listen(5000, () => {
    console.log(chalk.bold.green('Express:UOl online : porta 5000'))
})

//dotenv
dotenv.config()

//codigo
app.post('/sing-in', postSingIn)

app.post('/sing-up', postSingUp)

app.post('/output', postOutput )

app.post('/entry', postEntry )

app.get('/transference', getTransference)

app.post('/logout', postLogout)