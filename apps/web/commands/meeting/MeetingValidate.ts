import { BaseCommand } from "interfaces"
import { MeetingContext } from "./MeetingContext"

import { isString, isEmpty } from "lodash"
import { log } from "next-axiom"
import { isNumber } from "../../utils"

export class MeetingValidate extends BaseCommand<MeetingContext> {
  async execute(context: MeetingContext): Promise<void> {
    if (
      !isNumber(context.meetingNumber) ||
      !(isString(context.userName) && !isEmpty(context.userName)) ||
      !isString(context.passWord)
    ) {
      log.warn("Invalid query params", this.getQueryParamObj(context))
      throw new Error("Invalid query params")
    }
  }

  private getQueryParamObj(context: MeetingContext): Object {
    const { meetingNumber, userName, passWord } = context
    return { meetingNumber, userName, passWord }
  }
}
