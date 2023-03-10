import { log } from "next-axiom"

import { BaseCommand } from "interfaces"
import { MeetingContext } from "./MeetingContext"

import { ZoomConfigModel as config } from "../../model"

export class MeetingStartZoom extends BaseCommand<MeetingContext> {
  // eslint-disable-next-line no-unused-vars
  constructor(context: MeetingContext) {
    super(context)
  }

  async execute(): Promise<void> {
    const zoomMtg = this.context.zoomMtg
    const context = this.context

    const meetingNumber: number = Number(context.meetingNumber)
    const userName = String(context.userName)
    const passWord = String(context.passWord)
    const signature = context.signature

    zoomMtg.init({
      leaveUrl: config.leaveUrl,
      success: (success: any) => {
        log.info(success)

        zoomMtg.join({
          signature,
          meetingNumber,
          userName,
          sdkKey: config.sdkKey,
          passWord,
          success: (success: any) => {
            log.info(success)
          },
          error: (error: any) => {
            log.error(error)
            throw error
          }
        })
      },
      error: (error: any) => {
        log.error(error)
        throw error
      }
    })
  }
}
