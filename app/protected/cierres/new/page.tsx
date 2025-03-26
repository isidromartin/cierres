import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CierreForm } from "@/components/cierre-form";

export default async function NuevoCierrePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-3xl mx-auto w-full py-10">
      <h1 className="text-2xl font-bold mb-6">Nuevo cierre</h1>
      <CierreForm userId={user.id} />
    </div>
  );
}
