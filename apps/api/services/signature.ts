import { KJUR } from "jsrsasign";

const oHeader = { alg: "HS256", typ: "JWT" };
const RoleHost = 0;

export function createSignature(meetingNumber: number): string {
  const now = new Date().getTime();
  const iat = Math.round(now / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oPayload = {
    sdkKey: process.env.ZOOM_SDK_KEY,
    mn: meetingNumber,
    role: RoleHost,
    iat,
    exp,
    appKey: process.env.ZOOM_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_SDK_SECRET
  );

  return signature;
}
