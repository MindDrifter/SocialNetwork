const express = require('express')
const NewModel = require('../models/newModel')
const sha = require('js-sha256')
const router  = express.Router()
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function(req, file,callback ){
        callback(null, './images/')
    },
    filename: function(req, file, callback){
        callback(null, Date.now()+file.originalname)
    },
})

const upload = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 3,
    },
})

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
            token: token,
            name: req.body.name,
            lastName: req.body.lastName
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
        token:value[0].token,
        name:value[0].name,
        lastName: value[0].lastName
    })
})

router.post('/upload', async(req, res)=>{
    //const base64 = fs.readFileSync(__dirname+"/images/new-asdasdpath.jpg", "base64");
    //console.log(base64);
    const buffer = Buffer.from(req.body.image, "base64");
    //fs.writeFileSync("new-asdasdpath.jpg", buffer);
    fs.writeFileSync(__dirname+'/images/new-asdasdpath'+Date.now()+ '.jpg', buffer);
})

router.get('/get', async(req, res)=>{
    res.sendFile(__dirname+'/images/img.jpg')
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