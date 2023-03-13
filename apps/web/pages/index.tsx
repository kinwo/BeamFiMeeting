import { MouseEvent, useEffect, useMemo, useState } from "react"
import Head from "next/head"
import Image from "next/image"

import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Heading,
  Input,
  FormHelperText,
  Flex,
  Center,
  HStack,
  Spacer,
  Text
} from "@chakra-ui/react"

import { MajorActionButton } from "../ui/components/button/MajorActionButton"

import { log } from "next-axiom"

import { MacroCommand } from "interfaces"
import { useRouter } from "next/router"
import { MeetingContext } from "../commands/meeting/MeetingContext"
import { MeetingValidate } from "../commands/meeting/MeetingValidate"
import { MeetingFetchSignature } from "../commands/meeting/MeetingFetchSignature"

import { ZoomConfigModel as config } from "../model"

// Set log level
log.logLevel = String(process.env.NEXT_PUBLIC_AXIOM_LOG_LEVEL)

const meetingElementId = "meetingElement"

export default function ZoomComponentApp() {
  const [participantName, setParticipantName] = useState("")
  const [meetingId, setMeetingId] = useState("")
  const [meetingPassword, setMeetingPassword] = useState("")
  const [hasBlurredNameInput, setHasBlurredNameInput] = useState(false)
  const [hasBlurredMeetingIdInput, setHasBlurredMeetingIdInput] =
    useState(false)
  const [isShowZoom, setShowZoom] = useState(false)

  const invalidParticipantName = useMemo(
    () => !participantName,
    [participantName]
  )

  const invalidMeetingId = useMemo(() => !meetingId, [meetingId])

  const isInvalid = invalidParticipantName || invalidMeetingId

  const isParticipantNameInputInvalid = useMemo(
    () => invalidParticipantName && hasBlurredNameInput,
    [invalidParticipantName, hasBlurredNameInput]
  )

  const isMeetingIdInputInvalid = useMemo(
    () => invalidMeetingId && hasBlurredMeetingIdInput,
    [invalidMeetingId, hasBlurredMeetingIdInput]
  )

  const router = useRouter()

  useEffect(() => {
    const query = router.query
    setMeetingId(query.meetingId as string)
    setMeetingPassword(query.meetingPassword as string)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

  async function joinMeeting(e: MouseEvent<HTMLElement>) {
    e.preventDefault()

    if (isInvalid) {
      setHasBlurredNameInput(true)
      setHasBlurredMeetingIdInput(true)
      return
    }

    // create context
    const context: MeetingContext = {
      meetingNumber: meetingId,
      userName: participantName,
      passWord: meetingPassword
    }

    // Create cmds and execute as batch macro
    const validateCmd = new MeetingValidate(context)
    const fetchCmd = new MeetingFetchSignature(context)

    const macroCmd = new MacroCommand<MeetingContext>(context, [
      validateCmd,
      fetchCmd
    ])

    try {
      setShowZoom(true)
      await macroCmd.execute()

      if (context.signature == null) throw new Error("Invalid Signature")

      const ZoomMtgEmbedded = (await import("@zoomus/websdk/embedded")).default
      const client = ZoomMtgEmbedded.createClient()

      const meetingSDKElement = document.getElementById(
        meetingElementId
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
        signature: context.signature,
        meetingNumber: meetingId,
        password: meetingPassword,
        userName: participantName
      })
    } catch (error: any) {
      log.error("Error in joining meeting: ", error)
    }
  }

  const handleParticipantNameChange = (event: {
    target: { value: string }
  }) => {
    setParticipantName(event.target.value)
  }

  const handleMeetingIdChange = (event: { target: { value: string } }) => {
    setMeetingId(event.target.value)
  }

  const handleMeetingPasswordChange = (event: {
    target: { value: string }
  }) => {
    setMeetingPassword(event.target.value)
  }

  return (
    <>
      <Head>
        <title>BeamFi Meeting App</title>
      </Head>

      {isShowZoom && (
        <Center>
          <Box id={meetingElementId} />
        </Center>
      )}

      {!isShowZoom && (
        <Flex direction="column" height="100vh">
          <HStack spacing={2} pt={3}>
            <Spacer />
            <Box w="160px">
              <a
                href="https://beamfi.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text fontSize="xs" py={1}>
                  Powered by{" "}
                </Text>
                <Image
                  src="/beamfi-logo-dark.svg"
                  alt="BeamFi Logo"
                  width={130}
                  height={35}
                  priority
                />
              </a>
            </Box>
          </HStack>

          <Center height="100%" zIndex={1}>
            <Flex direction="column" align="center" mt="-260px">
              <Box background="white" padding="4" borderRadius="4">
                <Stack spacing="3">
                  <Heading>Start Zoom Meeting</Heading>

                  <FormControl
                    isInvalid={isParticipantNameInputInvalid}
                    onBlur={() => {
                      setHasBlurredNameInput(true)
                    }}
                  >
                    <FormLabel>Your Name</FormLabel>
                    <Input
                      maxLength={40}
                      id="participant_name"
                      value={participantName}
                      onChange={handleParticipantNameChange}
                    />
                    <FormHelperText
                      color={
                        !isParticipantNameInputInvalid ? "white" : "#E22C3E"
                      }
                    >
                      This cannot be empty.
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    isInvalid={isMeetingIdInputInvalid}
                    onBlur={() => {
                      setHasBlurredMeetingIdInput(true)
                    }}
                  >
                    <FormLabel>Meeting ID</FormLabel>
                    <Input
                      maxLength={40}
                      id="meeting_id"
                      value={meetingId}
                      onChange={handleMeetingIdChange}
                    />
                    <FormHelperText
                      color={!isMeetingIdInputInvalid ? "white" : "#E22C3E"}
                    >
                      This cannot be empty.
                    </FormHelperText>
                  </FormControl>

                  <FormControl pb="20px">
                    <FormLabel>Meeting Password</FormLabel>
                    <Input
                      maxLength={40}
                      id="meeting_password"
                      value={meetingPassword}
                      onChange={handleMeetingPasswordChange}
                      type="password"
                    />
                  </FormControl>

                  <MajorActionButton width="full" onClick={joinMeeting}>
                    Start
                  </MajorActionButton>
                </Stack>
              </Box>
            </Flex>
          </Center>
        </Flex>
      )}
    </>
  )
}
