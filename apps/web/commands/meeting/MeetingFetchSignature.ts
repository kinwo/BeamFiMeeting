import { BaseCommand, Signature } from "interfaces"
import { MeetingContext } from "./MeetingContext"

import { ZoomConfigModel as config } from "../../model"

export class MeetingFetchSignature extends BaseCommand<MeetingContext> {
  async execute(context: MeetingContext): Promise<void> {
    const meetingNumber: number = Number(context.meetingNumber)

    const res = await fetch(config.signatureEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber,
        role: config.role
      })
    })

    if (!res.ok) {
      throw new Error("Invalid response when fetching signature")
    }

    const { signature }: Signature = await res.json()
    context.signature = signature
  }
}
