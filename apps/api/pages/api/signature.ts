import type { NextApiRequest, NextApiResponse } from "next"
import Cors from "cors"

import { Signature } from "interfaces"
import { createSignature } from "../../services/signature"
import { isInteger, isPositive, runMiddleware } from "../../utils"

import { sanitizeJSURL } from "../../utils/security"

/// https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST"]
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Signature | string>
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  // validate
  if (req.method !== "POST") {
    res.status(400).send("Invalid HTTP method")
    return
  }

  const meetingNumber = req.body.meetingNumber
  const isValid = isInteger(meetingNumber) && isPositive(meetingNumber)

  if (!isValid) {
    res
      .status(400)
      .send(
        `Invalid request body parameter meetingNumber: ${sanitizeJSURL(
          meetingNumber
        )}`
      )
    return
  }

  // create
  const signature = createSignature(meetingNumber)
  res.status(200).json({ signature })
}
