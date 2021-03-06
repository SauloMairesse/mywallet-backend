import {v4 as uuid} from 'uuid'
import bcrypt from 'bcrypt'
import chalk from 'chalk'
import database from '../database.js'
import dayjs from 'dayjs'
import joi from 'joi'

const singUpJOI = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.required()
});

const singInJOI = joi.object({
    name: joi.string().required(),
    userID: joi.string().required(),
    token: joi.required()
});

const transferenceJOI = joi.object({
    type: joi.any().valid('entry', 'output').required(),
    user: joi.string().required(),
    date: joi.required(),
    value: joi.required(),
    description: joi.string().required()
});


export async function postSingIn(req, res){
    const { email, password } = req.body
    try{
        const user = await database.collection('users').findOne({ email });
        if(user && bcrypt.compareSync(password, user.password)){
            const token = uuid()
            const config = {name: user.name,
                            userId: user._id,
                            token }
            console.log(chalk.bold.green('deu certo login'))
            console.log('enviando...\n',config)
            await database.collection('sessions').insertOne(config)
            res.status(201).send(config)
            return
        }
        if(!user || !bcrypt.compareSync(password, user.password)){
            res.status(401).send('User not exist or Wrong password')
            return
        }
        } catch (err){ 
            console.log(chalk.bold.red('erro sing-in\n',err))
            return res.status(500).send('usuario nao existente')
        }
}

export async function postSingUp(req,res){
    const {name, email, password} = req.body
    const passwordHash = bcrypt.hashSync(password,10)
    const user = {name: name,
                    email: email, 
                    password: passwordHash}
    const validation = singUpJOI.validate(user, {abortEarly: false})
    if(validation.error) {
        res.sendStatus(422)
        return
    }
    try{
        const alreadyRegistered = await database.collection("users").findOne({email})
        if(alreadyRegistered){
            res.status(401).send('Email already registered')
            return
        }
        await database.collection("users").insertOne(user)
        console.log('Registro Feito e senha criptografada\n',user)
        res.sendStatus(201)
    } catch (err){
        console.log(chalk.bold.red('erro sing-up\n',err))
        res.sendStatus(500)
    }
}

export async function postOutput(req,res){
    const {value, description} = req.body
    const {user} = req.headers 
    const output = {type: 'output',
                    user: user,
                    date: dayjs().format('DD/MM'),
                    value: -value,
                    description: description}
    const validation = transferenceJOI.validate(output, {abortEarly: false})
    if(validation.error) {
        res.sendStatus(422)
        return
    }
    try{
        await database.collection("transference").insertOne(output)
        console.log('Transferencia OutPut\n',output)
        res.sendStatus(201)
    } catch (err){
        console.log(chalk.bold.red('erro output\n',err))
        res.sendStatus(500)
    }
}

export async function postEntry(req,res){
    const {value, description} = req.body
    const {user} = req.headers
    const entry = {type: 'entry',
                    user: user,
                    date: dayjs().format('DD/MM'),
                    value: value,
                    description: description}
    const validation = transferenceJOI.validate(entry, {abortEarly: false})
    if(validation.error) {
        res.sendStatus(422)
        return
    }
    try{
        await database.collection("transference").insertOne(entry)
        console.log('Transferencia Entry\n',entry)
        res.sendStatus(201)
    } catch (err){
        console.log(chalk.bold.red('erro entry\n',err))
        res.sendStatus(500)
    }
}

export async function getTransference(req, res){
    const {user} = req.headers
    try{
        const transferHistory = await database.collection("transference").find().toArray()
        const userHistory = transferHistory.filter( transfer => transfer.user === user ) 
        console.log('usuario Transferencia\n', userHistory)
        res.status(201).send(userHistory)
    } catch (err){
        console.log(chalk.bold.red('erro get Transference\n',err))
        res.sendStatus(500)
    }
}

export async function postLogout(req,res){
    const {token} = req.body
    try{
        const logout = await database.collection("sessions").findOne(token)
        console.log(logout)
        if(logout){
            await database.collection("sessions").deleteOne(logout)
            console.log('Logout user')
            res.sendStatus(201)
        }
    } catch (err){
        console.log(chalk.bold.red('erro logout\n',err))
        res.sendStatus(500)
    }
}