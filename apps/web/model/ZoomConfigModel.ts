import { ZoomConfig } from "../interfaces"

export const ZoomConfigModel: ZoomConfig = {
  signatureEndpoint: process.env.NEXT_PUBLIC_ZOOM_SIGNATURE_ENDPOINT!,
  sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
  role: 0,
  leaveUrl: process.env.NEXT_PUBLIC_ZOOM_LEAVE_URL!
}
