import type { NextApiRequest, NextApiResponse } from "next"
import Cors from "cors"

import { Signature } from "interfaces"
import { checkClientKey } from "../../services/signature"
import { runMiddleware } from "../../utils"

/// https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST"]
})

const ZOOM_HEADER_SIGNATURE = "x-zm-signature"
const ZOOM_HEADER_TIMESTAMP = "x-zm-request-timestamp"
const HTTP_HEADER_CONTENT_TYPE = "content-type"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Signature | string>
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  // check client key
  const clientKey = req.query.clientKey
  if (!checkClientKey(clientKey as string)) {
    res.status(400).send("Unauthorized HTTP request")
    return
  }

  // validate
  if (req.method !== "POST") {
    res.status(400).send("Invalid HTTP method")
    return
  }

  const zmSignatureHeader: string = req.headers[ZOOM_HEADER_SIGNATURE] as string
  const zmTimestamp: string = req.headers[ZOOM_HEADER_TIMESTAMP] as string
  const httpContentType: string = req.headers[
    HTTP_HEADER_CONTENT_TYPE
  ] as string

  // redirect request to IC canister
  const icEndpoint: string = process.env.BEAMFI_IC_ZOOM_ENDPOINT as string
  const httpEndPoint = `${icEndpoint}?clientKey=${clientKey}`

  const headers: { [key: string]: string } = {}
  headers[ZOOM_HEADER_SIGNATURE] = zmSignatureHeader || ""
  headers[ZOOM_HEADER_TIMESTAMP] = zmTimestamp || ""
  headers[HTTP_HEADER_CONTENT_TYPE] = httpContentType || ""

  const icResponse = await fetch(httpEndPoint, {
    method: "POST",
    headers,
    body: JSON.stringify(req.body)
  })

  const resText = await icResponse.text()
  res.status(icResponse.status).send(resText)
}
