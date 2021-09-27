// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getClients from "../../backend/clients/client.controller";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const clients = await getClients();
  console.log(clients);
  res.status(200).json({ name: "John Doe" });
}
