import { getUsers, getUsers2 } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const data = await getUsers();

  return Response.json(data);
}

export async function POST(request: Request) {
  const data = await getUsers2();

  return Response.json(data);
}