const customersRouter = require('express').Router()
const Customer = require('../models/customer')

customersRouter.get('/', async(request, response) => {
    const customers = await Customer.find({})
    response.json(customers.map(Customer.format))
})
customersRouter.get('/:id', async(request, response) => {
    console.log(request.params.id)
    const customer = await Customer.findById(request.params.id)
    response.json(Customer.format(customer))
})
customersRouter.post('/', async(request, response) => {
    console.log("POST - metodissa...")
    const body = request.body

    // todo: loput validoinnit
    if (!body.firstname || body.firstname.length === 0 || 
        !body.lastname  || body.lastname.length === 0) {
        return response.status(400).json({error: 'Nimitiedot puutteelliset'})
    }
    if(body.email.length === 0 || body.telephone.length === 0){
        return response.status(400).json({error: 'Yhteystiedot putteelliset'})
    }

    const customer = new Customer({
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username,
        address: body.address,
        created: new Date().toISOString(),
        email: body.email,
        telephone: body.telephone,
        department: body.department
    })
    const savedcustomer = await customer.save()
    response.status(201).json(savedcustomer)
})

module.exports = customersRouter
