const express = require('express')
const app = express()
const fetch = require('node-fetch')
app.use(express.json())

app.get('/api/rates', async(req,res)=>{
    let result = await fetch('https://api.exchangeratesapi.io/latest')
    let rates = await result.json()
    let data = req.query
    
    if(data.base && data.currency){
        let conv = data.currency.split(',').filter(i=> Object.keys(rates.rates).includes(i.trim()) || i.trim()=='EUR')
        let ress = conv.map(i=> check(rates.rates, i.trim()))
        let base = check(rates.rates, data.base)
        
        if(base){
            let obj ={}
            ress.map((i,k)=> obj[conv[k]]=i/base)
            res.status(200).json({
                results:{
                    base: data.base,
                    date: rates.date,
                    rates: obj
                }
            })
        }else{
            res.status(400).json({
                error: 400,
                message: "Base currency provided not supported"
            })
        }

    }else{
        res.status(400).json({
            error: 400,
            message: "Base currency or at least one convert currency not provided"
        })
    }
})

function check(obj, currency){
    currency = currency.toUpperCase()
    if(currency == "EUR"){
        return 1
    }
    return obj[currency]
}

app.listen(5000,()=>{
    console.log('Listening at port 5000')
})