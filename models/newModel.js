const {Schema, model} = require('mongoose')

const schema = new Schema({
    login: {
        type: String,
        require: true,
    },
    token:{
        type: String,
        require:true
    },
    name:{
        type: String,
        require:true
    },
    lastName:{
        type: String,
        require: true
    },
})

module.exports = model ('NewModel', schema)
