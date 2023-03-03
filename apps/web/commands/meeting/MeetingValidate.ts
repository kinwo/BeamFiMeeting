import { BaseCommand } from "interfaces"
import { MeetingContext } from "./MeetingContext"

import { isString } from "lodash"
import { log } from "next-axiom"
import { isNumber } from "../../utils"

export class MeetingValidate extends BaseCommand<MeetingContext> {
  async execute(): Promise<void> {
    if (
      !isNumber(this.context.meetingNumber) ||
      !isString(this.context.userName) ||
      !isString(this.context.passWord)
    ) {
      log.warn("Invalid query params", this.getQueryParamObj())
      throw new Error("Invalid query params")
    }

    log.info("Valid query params: ", this.getQueryParamObj())
  }

  private getQueryParamObj(): Object {
    const { meetingNumber, userName, passWord } = this.context
    return { meetingNumber, userName, passWord }
  }
}
