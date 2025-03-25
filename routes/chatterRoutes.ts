import express, { Request, Response } from 'express'
import { ChatterService } from '../Services/ChatterService'
import { ChatterName } from '../models/ChatterName'

const chatterService = new ChatterService()
const ChatterRouter = express.Router()

ChatterRouter.get('/manage-chatters', async (req: Request, res: Response) => {
    const chatters = await chatterService.GetFullChatters()
    res.render('manageChatters', { pageName: "manageme chatters", chatters: chatters })
})

ChatterRouter.get('/add-preferred-name/', (req: Request, res: Response) => {
    res.render('addPreferredName', { pageName: "add preferred name" })
})

ChatterRouter.get('/add-preferred-name/:id', async (req: Request, res: Response) => {
    const chatter = await chatterService.GetChatterNameById(req.params.id)
    if (!chatter) {
        res.redirect('/manage-chatters')
    }
    res.render('addPreferredNameForPerson', { pageName: "add preferred name", chatter: chatter })
})

ChatterRouter.post('/add-preferred-name', (req: Request, res: Response) => {
    chatterService.SaveChatterName({
        UserId: req.body.userId,
        PreferredName: req.body.preferredName,
    } as ChatterName)

    res.redirect('/manage-chatters')
})

export { ChatterRouter }