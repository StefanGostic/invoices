import { getAllMaterials, insertMaterials } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const data = await getAllMaterials();

  return Response.json(data);
}

export async function POST(request: Request) {
  const res = await request.json();
  await insertMaterials(res);
  return Response.json({ res });
}
