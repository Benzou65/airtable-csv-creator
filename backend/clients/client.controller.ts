import Airtable from "airtable";
import axios from "axios";
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);
const table = base(process.env.AIRTABLE_TABLE_ID as string);

export default async function getClients(): Promise<any[]> {
  const records = await table
    .select({
      maxRecords: 100,
      view: "Grid view",
    })
    .all();

  const clientInfos = records.map((record) => {
    return {
      id: record.id,
      name: record.fields.Name,
      zipCode: record.fields["Code postal"] || null,
      city: record.fields["Ville/Localisation de l'usine"],
      status: record.fields["Etat du client"],
    };
  });

  interface TCoordinates {
    lat: number | null;
    lng: number | null;
  }

  async function getCoordinates(clientInfo: any): Promise<TCoordinates> {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        clientInfo.city as string
      )}&key=${process.env.GOOGLE_GEOCODING_API_KEY}`
    );
    if (data.results.length > 0) {
      return data.results[0].geometry.location;
    } else return { lat: null, lng: null };
  }

  const asyncRes = await Promise.all(
    clientInfos.map(async (clientInfo) => {
      // Fetch coordinates from google geocoding api for each client
      const coordinates = await getCoordinates(clientInfo);

      const clientWithCoordinates = { ...clientInfo, ...coordinates };

      return clientWithCoordinates;
    })
  );

  return asyncRes;
}
