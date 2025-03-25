import { OverlayInformation } from "../models/OverlayInformation";
import { OverlayRepository } from "../Repositories/OverlayRepository";

export class OverlayService {

    readonly overlayRepository = new OverlayRepository()

    async AddOvelay(info: OverlayInformation) {
        await this.overlayRepository.SaveOverlayToDb(info)
    }

    async DeleteOverlay(overlayId: string) {
        await this.overlayRepository.DeleteOverlayFromDb(overlayId)
    }

    /**
     * 
     * @param overlayId {string} The ID of the overlay
     * @param lookForNeighbours {boolean} Whether the overlays before and after the current one should also be fetched. Default is false to prevent recursiveness and fetching more data than needed. When true, allows seeing the title of previous and next tale
     * @returns 
     */
    async GetOverlayById(overlayId: string, lookForNeighbours: boolean = false): Promise<OverlayInformation> {
        const allOverlays = await this.overlayRepository.GetAllOverlaysFromDb()
        const overlay = allOverlays.find(o => o.Id === overlayId)
        if (lookForNeighbours) {
            if (overlay) {
                if (overlay.NextTale !== overlayId) {
                    overlay.NextTaleName = (await this.GetOverlayById(overlay.NextTale))?.Title ?? "none"
                }
                if (overlay.PreviousTale !== overlayId) {
                    overlay.PreviousTaleName = (await this.GetOverlayById(overlay.PreviousTale))?.Title ?? "none"
                }
            }
        }

        return overlay
    }

    async GetAllOverlays(): Promise<OverlayInformation[]> {
        return await this.overlayRepository.GetAllOverlaysFromDb()
    }
}
