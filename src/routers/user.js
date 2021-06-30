const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { route } = require('../app')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email','password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/allUsers', auth, async (req, res) => {
    try {
        const users= await User.find({isAdmin:false})
        res.status(201).send(users)
    } catch (e) {
        res.status(500).send('not working')
    }
})

router.delete('/deleteOne/:id',auth,async(req,res) =>{
    try{
        const user = await User.findOneAndDelete({ _id: req.params.id})
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send('not working')
    }
})

router.get('/findOne/:id',auth,async(req,res) =>{
    try{
        const user = await User.findOne({ _id: req.params.id})
        res.status(200).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports = router