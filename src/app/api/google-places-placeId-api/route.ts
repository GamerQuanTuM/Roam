import { axiosInstance } from "@/libs/config";
import cors from "@/libs/cors";
import axios from "axios";

type RequestBody = {
    placeName: string,
    placeBaseUrl: string,
}

export async function POST(req: Request) {
    const body: RequestBody = await req.json();

    const { placeName, placeBaseUrl } = body

    const response = await axiosInstance.get(
        `${placeBaseUrl}?input=${placeName}&inputtype=textquery&fields=formatted_address%2Cname%2Cgeometry%2Cphoto%2Cplace_id&key=${process.env.NEXT_PUBLIC_GOOGLE_API_MAP_KEY}`
    );

    const results = await response.data;
    console.log(results)
    return cors(
        req,
        new Response(JSON.stringify(results), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    );
}

export async function OPTIONS(request: Request) {
    return cors(
        request,
        new Response(null, {
            status: 204,
        })
    );
}