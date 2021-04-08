const express = require('express')
const NewModel = require('../models/newModel')
const sha = require('js-sha256')
const router  = express.Router()

//GET
router.get('/', async (req, res)=>{ 
    
    res.set('Access-Control-Allow-Origin', '*')
    
    const value = await NewModel.find({})
     res.status(200).json(value)
})

//POST
router.post('/register', async(req, res)=>{
    var login = req.body.login.trim()
    var password = req.body.password.trim()
    var token = sha.sha256(login+password)
    
    if(await (await NewModel.find({"token":token})).length > 0){
        res.status(200).send('Такой аккаунт уже существует')
    }else{
        const model = new NewModel({
            login: login ,
            token: token
        })
        await model.save()
        res.status(201).send({
            msg:'Вы успешно зарегестрировались',
            token:token
        })
    }
})

router.post('/login', async(req, res)=>{
    var login = req.body.login.trim()
    var password = req.body.password.trim() 
    var token = sha.sha256(login+password)
    
    var value = await NewModel.find({
        "token":token
    })
    res.status(200).json({
        msg:'Вы успешно вошли',
        token:value[0].token})
})

//DELETE
router.delete('/delete', async(req, res)=>{
    NewModel.findByIdAndRemove({_id: req.body.id}, (e)=>{
        if (e){
            console.log(e)
            res.status(500).send()
        }else{
            res.status(200).send()
        }
    })
})

module.exports = router;