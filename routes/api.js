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
router.post('/', async(req, res)=>{
    const model = new NewModel({
        name: req.body.name,
        token: sha.sha256(req.body.password+req.body.title)
    })
    await model.save()
    res.status(201).send('Успешная регистрация')
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