import type { NextApiRequest, NextApiResponse } from "next";
import { Signature } from "../../interfaces";
import { createSignature } from "../../services/signature";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Signature | String>
) {
  // validate
  if (req.method !== "POST") {
    res.status(400).send("Invalid HTTP method");
    return;
  }

  const meetingNumber = req.body.meetingNumber;
  const isValid = isInteger(meetingNumber) && isPositive(meetingNumber);

  if (!isValid) {
    res.status(400).send("Invalid request body parameter meetingNumber");
    return;
  }

  const signature = createSignature(meetingNumber);

  res.status(200).json({ signature });
}

const isInteger = (str: String): Boolean => Number.isInteger(str);
const isPositive = (str: Number): Boolean => str > 0;
