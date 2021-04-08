const {Schema, model} = require('mongoose')

const schema = new Schema({
    login: {
        type: String,
        require: false,
    },
    token:{
        type: String,
        require:true
    }
})

module.exports = model ('NewModel', schema)
