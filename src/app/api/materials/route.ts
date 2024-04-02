import {
  getAllMaterials,
  insertMaterials,
  updateMaterial,
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

export async function PATCH(request: Request) {
  const res = await request.json();
  const searchParams = new URLSearchParams(request.url.split("?")[1]);
  const id = searchParams.get("id");
  let updatedMaterial = null;
  if (id) {
    updatedMaterial = await updateMaterial(parseInt(id), res);
  }
  return Response.json({ updatedMaterial });
}
