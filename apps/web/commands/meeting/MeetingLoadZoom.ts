import { BaseCommand } from "interfaces"
import { MeetingContext } from "./MeetingContext"

const ZoomLibURI = "https://source.zoom.us/2.9.7/lib"
const ZoomLang = "en-US"

export class MeetingLoadZoom extends BaseCommand<MeetingContext> {
  async execute(context: MeetingContext): Promise<void> {
    const { ZoomMtg } = await import("@zoomus/websdk")

    ZoomMtg.setZoomJSLib(ZoomLibURI, "/av")
    ZoomMtg.preLoadWasm()
    ZoomMtg.prepareWebSDK()
    ZoomMtg.i18n.load(ZoomLang)
    ZoomMtg.i18n.reload(ZoomLang)

    context.zoomMtg = ZoomMtg
  }
}
