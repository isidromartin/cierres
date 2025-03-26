// app/protected/cierres/[id]/delete/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { id } = context.params;

  await supabase.from("cierres").delete().eq("id", id).eq("user_id", user.id);

  // if (error) {
  //   console.error("Error al eliminar:", error);
  // }

  return NextResponse.redirect(new URL("/protected/cierres", request.url));
}
