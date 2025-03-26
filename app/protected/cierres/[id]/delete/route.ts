// app/protected/cierres/[id]/delete/route.ts
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { error } = await supabase
    .from("cierres")
    .delete()
    .match({ id: params.id, user_id: user.id });

  if (error) {
    console.error("Error al eliminar:", error);
    // Podrías redirigir con error visual aquí si quieres
  }

  redirect("/protected/dashboard");
}
