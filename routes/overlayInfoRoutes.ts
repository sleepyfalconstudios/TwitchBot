import express, { Request, Response } from 'express'
import { OverlayInformation } from '../models/OverlayInformation'
import { OverlayService } from '../Services/OverlayService'

const overlayService = new OverlayService()
const OverlayInfoRouter = express.Router()

OverlayInfoRouter.get('/manage-stories', async (req: Request, res: Response) => {
    const overlays = await overlayService.GetAllOverlays()
    res.render('manageStories', { pageName: "home", stories: overlays })
})

OverlayInfoRouter.get('/manage-stories/:id', async (req: Request, res: Response) => {
    const overlay = await overlayService.GetOverlayById(req.params.id)
    if (overlay?.Title) {
        res.render('storyDetails', { pageName: overlay.Title, info: overlay })
    } else {
        res.render('404')
    }
})

OverlayInfoRouter.get('/add-story', (req: Request, res: Response) => {
    res.render('addStory', { pageName: "add story" })
})

OverlayInfoRouter.get('/overlay/:id', async (req: Request, res: Response) => {
    const overlay = await overlayService.GetOverlayById(req.params.id, true)
    res.render('obsOverlay', { pageName: "overlay", info: overlay })
})

OverlayInfoRouter.delete('/manage-stories/:id', (req: Request, res: Response) => {
    overlayService.DeleteOverlay(req.params.id)
    res.json({ redirect: '/manage-stories' })
})

OverlayInfoRouter.post('/add-story', (req: Request, res: Response) => {
    overlayService.AddOvelay({
        Title: req.body.title,
        ContentWarning: req.body.contentWarning.split(';'),
        InterestingInfo: req.body.interestingInfo.split(';'),
        NextTale: req.body.nextTale ?? "none",
        PreviousTale: req.body.previousTale ?? "none"
    } as OverlayInformation)

    res.redirect('/manage-stories')
})

export { OverlayInfoRouter }