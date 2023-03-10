import { useEffect } from "react"

import Head from "next/head"

import { log } from "next-axiom"

import { MacroCommand } from "interfaces"
import { MeetingContext } from "../commands/meeting/MeetingContext"
import { MeetingFetchSignature } from "../commands/meeting/MeetingFetchSignature"

import { ZoomConfigModel as config } from "../model"

// Set log level
log.logLevel = String(process.env.NEXT_PUBLIC_AXIOM_LOG_LEVEL)

const ZoomLibURI = "https://source.zoom.us/2.10.1/lib"
const ZoomLang = "en-US"

export default function ZoomWebApp() {
  useEffect(() => {
    async function loadZoom() {
      // create context
      const context: MeetingContext = {
        meetingNumber: 88504320472,
        userName: "Sam",
        passWord: "4VJCzj"
      }

      // Create cmds and execute as batch macro
      const fetchCmd = new MeetingFetchSignature(context)
      const macroCmd = new MacroCommand<MeetingContext>(context, [fetchCmd])

      try {
        macroCmd.execute()

        const { ZoomMtg } = await import("@zoomus/websdk")

        ZoomMtg.setZoomJSLib(ZoomLibURI, "/av")
        ZoomMtg.preLoadWasm()
        ZoomMtg.prepareWebSDK()
        ZoomMtg.i18n.load(ZoomLang)

        const meetingNumber: number = Number(context.meetingNumber)
        const userName = String(context.userName)
        const passWord = String(context.passWord)
        const signature = context.signature

        if (signature == null) throw new Error("Signature is null")

        log.info("MeetingStartZoom props:", {
          signature,
          meetingNumber,
          userName,
          passWord,
          leaveUrl: config.leaveUrl
        })

        ZoomMtg.init({
          leaveUrl: config.leaveUrl,
          success: (success: any) => {
            log.info(success)

            ZoomMtg.join({
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
      } catch (error: any) {
        log.error("Error in joining meeting: ", error)
      }
    }

    loadZoom()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [1])

  return (
    <>
      <Head>
        <title>BeamFi Meeting App</title>
        <link
          type="text/css"
          rel="stylesheet"
          href="https://source.zoom.us/2.9.7/css/bootstrap.css"
        />
        <link
          type="text/css"
          rel="stylesheet"
          href="https://source.zoom.us/2.9.7/css/react-select.css"
        />
      </Head>
    </>
  )
}
