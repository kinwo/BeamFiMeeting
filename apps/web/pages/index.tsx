import { MouseEvent, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";

import {
  Button,
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
  useDisclosure,
  Spacer,
  Text,
} from "@chakra-ui/react";

import MajorActionButton from "../ui/components/button/MajorActionButton";

import { isNumber, isString } from "lodash";
import { log } from "next-axiom";

import { ZoomConfigModel as config } from "../model";
import { Signature } from "interfaces";
import { useRouter } from "next/router";

const ZoomLibURI = "https://source.zoom.us/2.9.7/lib";
const ZoomLang = "en-US";
const zoomElementId = "zmmtg-root";

export default function ZoomWebApp() {
  const router = useRouter();

  async function joinMeeting(e: MouseEvent<HTMLElement>) {
    e.preventDefault();

    // validate
    const query = router.query;

    if (
      !isNumber(query.meetingNumber) ||
      !isString(query.userName) ||
      !isString(query.passWord)
    ) {
      log.warn("Invalid query params", query);
      return;
    }

    log.info("Valid query params: ", query);

    const meetingNumber: number = Number(query.meetingNumber);
    const userName = String(query.userName);
    const passWord = String(query.passWord);

    try {
      const signature = await fetchSignature(meetingNumber);
      const ZoomMtg = await loadZoom();
      await startMeeting(ZoomMtg, signature, userName, meetingNumber, passWord);
    } catch (error: any) {
      log.error("Error in fetching signature: ", error);
    }
  }

  async function loadZoom(): Promise<any> {
    const { ZoomMtg } = await import("@zoomus/websdk");

    ZoomMtg.setZoomJSLib(ZoomLibURI, "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load(ZoomLang);
    ZoomMtg.i18n.reload(ZoomLang);

    return ZoomMtg;
  }

  async function fetchSignature(meetingNumber: number): Promise<string> {
    const res = await fetch(config.signatureEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber,
        role: config.role,
      }),
    });

    if (!res.ok) {
      throw new Error("Invalid response when fetching signature");
    }

    const { signature }: Signature = await res.json();
    return signature;
  }

  function startMeeting(
    ZoomMtg: any,
    signature: string,
    userName: string,
    meetingNumber: number,
    passWord: string
  ) {
    const zoomElement = document.getElementById(
      zoomElementId
    ) as HTMLInputElement;
    zoomElement.style.display = "block";

    ZoomMtg.init({
      leaveUrl: config.leaveUrl,
      success: (success: any) => {
        log.info(success);

        ZoomMtg.join({
          signature,
          meetingNumber,
          userName,
          sdkKey: config.sdkKey,
          passWord,
          success: (success: any) => {
            log.info(success);
          },
          error: (error: any) => {
            log.error(error);
          },
        });
      },
      error: (error: any) => {
        log.error(error);
      },
    });
  }

  const [participantName, setParticipantName] = useState("");
  const [hasBlurredNameInput, setHasBlurredNameInput] = useState(false);

  const invalidParticipantName = useMemo(
    () => !participantName,
    [participantName]
  );

  const isInputInvalid = useMemo(
    () => invalidParticipantName && hasBlurredNameInput,
    [invalidParticipantName, hasBlurredNameInput]
  );

  const handleParticipantNameChange = (event: {
    target: { value: string };
  }) => {
    setParticipantName(event.target.value);
  };

  return (
    <>
      <Head>
        <title>BeamFi Meeting App</title>
      </Head>

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
              <Stack spacing="4">
                <Heading>Join Zoom Meeting</Heading>
                <FormControl
                  isInvalid={isInputInvalid}
                  onBlur={() => setHasBlurredNameInput(true)}
                >
                  <FormLabel>Meeting ID</FormLabel>
                  <Input
                    maxLength={40}
                    id="meeting_id"
                    value={participantName}
                    onChange={handleParticipantNameChange}
                  />
                  <FormHelperText color={!isInputInvalid ? "white" : "#E22C3E"}>
                    This cannot be empty.
                  </FormHelperText>
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    maxLength={40}
                    id="participant_name"
                    value={participantName}
                    onChange={handleParticipantNameChange}
                  />
                  <FormHelperText color={!isInputInvalid ? "white" : "#E22C3E"}>
                    This cannot be empty.
                  </FormHelperText>
                </FormControl>

                <MajorActionButton width="full" onClick={joinMeeting}>
                  Join
                </MajorActionButton>
              </Stack>
            </Box>
          </Flex>
        </Center>
      </Flex>
    </>
  );
}
