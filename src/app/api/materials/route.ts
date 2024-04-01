import {
  getAllMaterials,
  insertMaterials,
  updateMaterialQuantity,
} from "@/lib/db";
import { NextRequest } from "next/server";

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

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const quantity = searchParams.get("quantity");
  let updatedMaterial = null;
  if (id && quantity) {
    await updateMaterialQuantity(parseInt(id || ""), parseInt(quantity || ""));
  }
  return Response.json({ updatedMaterial });
}
