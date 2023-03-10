import { BaseCommand } from "interfaces"
import { MeetingContext } from "./MeetingContext"

import { ZoomConfigModel as config } from "../../model"

export class MeetingStartZoomComp extends BaseCommand<MeetingContext> {
  // eslint-disable-next-line no-unused-vars
  constructor(context: MeetingContext, public meetingElementId: string) {
    super(context)
  }

  async execute(): Promise<void> {
    const context = this.context

    const meetingNumber = String(context.meetingNumber)
    const userName = String(context.userName)
    const passWord = String(context.passWord)
    const signature = context.signature

    if (signature == null) throw new Error("Invalid Signature")

    const ZoomMtgEmbedded = (await import("@zoomus/websdk/embedded")).default
    const client = ZoomMtgEmbedded.createClient()

    const meetingSDKElement = document.getElementById(
      this.meetingElementId
    ) as HTMLElement
    client.init({
      zoomAppRoot: meetingSDKElement,
      language: "en-US",
      customize: {
        video: {
          isResizable: true,
          viewSizes: {
            default: {
              width: document.documentElement.scrollWidth,
              height: document.documentElement.scrollHeight
            }
          }
        }
      }
    })

    client.join({
      sdkKey: config.sdkKey,
      signature: signature,
      meetingNumber: meetingNumber,
      password: passWord,
      userName: userName
    })
  }
}
