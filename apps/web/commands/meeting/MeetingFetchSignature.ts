import { BaseCommand, Signature } from "interfaces"
import { MeetingContext } from "./MeetingContext"

import { ZoomConfigModel as config } from "../../model"
import { log } from "next-axiom"

export class MeetingFetchSignature extends BaseCommand<MeetingContext> {
  async execute(): Promise<void> {
    const meetingNumber: number = Number(this.context.meetingNumber)

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
    log.info("MeetingFetchSignature: ", { signature })

    this.context.signature = signature
  }
}