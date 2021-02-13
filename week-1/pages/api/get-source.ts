import {NextApiRequest, NextApiResponse} from "next";
import fetch from "node-fetch";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const source = req.query.src as string;

    const imageContents = await (await fetch(source)).buffer();

    res.status(200).json({source: Buffer.from(imageContents).toString("base64")})
}
