import { useState, useEffect, MouseEvent } from "react";

import { ZoomConfigModel as config } from "../model";
import { Signature } from "interfaces";
import { useRouter } from "next/router";
import { isNumber, isString } from "lodash";

const ZoomLibURI = "https://source.zoom.us/2.9.7/lib";
const ZoomLang = "en-US";
const zoomElementId = "zmmtg-root";

export default function ZoomWebApp() {
  const router = useRouter();

  async function loadZoom(): Promise<any> {
    const { ZoomMtg } = await import("@zoomus/websdk");

    ZoomMtg.setZoomJSLib(ZoomLibURI, "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load(ZoomLang);
    ZoomMtg.i18n.reload(ZoomLang);

    return ZoomMtg;
  }

  async function joinMeeting(e: MouseEvent<HTMLElement>) {
    e.preventDefault();

    const query = router.query;

    // validate
    if (
      !isNumber(query.meetingNumber) ||
      !isString(query.userName) ||
      !isString(query.passWord)
    ) {
      console.info("Invalid query params");
      return;
    }

    const meetingNumber: number = Number(query.meetingNumber);
    const userName = String(query.userName);
    const passWord = String(query.passWord);

    // TODO - Switch to proper logging lib
    console.info("query params:");
    console.info(query);

    try {
      const signature = await fetchSignature(meetingNumber);

      const ZoomMtg = await loadZoom();
      await startMeeting(ZoomMtg, signature, userName, meetingNumber, passWord);
    } catch (error) {
      console.error(error);
    }
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
        console.log(success);

        ZoomMtg.join({
          signature,
          meetingNumber,
          userName,
          sdkKey: config.sdkKey,
          passWord,
          success: (success: any) => {
            console.log(success);
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  return (
    <div className="App">
      <main>
        <h1>BeamFi Zoom Meeting</h1>
        <button onClick={joinMeeting}>Join Meeting</button>
      </main>
    </div>
  );
}
