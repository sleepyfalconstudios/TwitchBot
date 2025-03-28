import { OverlayInformation, OverlayInformationDto } from "../models/OverlayInformation";

export class OverlayRepository {
    async SaveOrUpdateOverlayToDb(info: OverlayInformation) {
        if (!info.Id) {
            const dto = new OverlayInformationDto({
                title: info.Title,
                contentWarning: info.ContentWarning,
                interestingInfo: info.InterestingInfo,
                nextTale: info.NextTale,
                previousTale: info.PreviousTale
            })

            const result = await dto.save()

            if (result?.errors) {
                console.log("failed to save overlays to database: ", result.errors.message)
            }
        } else {
            const result = await OverlayInformationDto.findByIdAndUpdate(
                info.Id,
                {
                    title: info.Title,
                    contentWarning: info.ContentWarning,
                    interestingInfo: info.InterestingInfo,
                    nextTale: info.NextTale,
                    previousTale: info.PreviousTale
                },
                { upsert: true, new: true }
            )

            if (result?.errors) {
                console.log("failed to save overlays to database: ", result.errors.message)
            }
        }
    }

    async DeleteOverlayFromDb(overlayId: string) {
        const result = await OverlayInformationDto.findByIdAndDelete(overlayId);

        if (result.errors) {
            console.log("Unable to delete overlay: ", result.errors.message)
        }
    }

    async GetAllOverlaysFromDb(): Promise<OverlayInformation[]> {
        const result = await OverlayInformationDto.find()

        if (result.length > 0) {
            return result.map(r => {
                return {
                    Id: r._id?.toString(),
                    Title: r.title,
                    ContentWarning: r.contentWarning,
                    InterestingInfo: r.interestingInfo,
                    NextTale: r.nextTale,
                    PreviousTale: r.previousTale
                } as OverlayInformation
            })
        } else {
            console.log("Could not get all overlays from db: ", result)
            return []
        }
    }
}
