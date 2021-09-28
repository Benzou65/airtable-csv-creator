// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getClients from "../../backend/clients/client.controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const clients = await getClients();

  res.status(200).json(clients);
}
