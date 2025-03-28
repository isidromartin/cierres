import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CierreForm } from "@/components/cierre-form";
import type { InitialData } from "@/components/cierre-form";

export default async function EditarCierrePage({ params }: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: cierre, error: errCierre } = await supabase
    .from("cierres")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!cierre || errCierre) {
    redirect("/protected/dashboard"); // o mostrar error
  }

  const { data: ingresos } = await supabase
    .from("ingresos")
    .select("*")
    .eq("cierre_id", cierre.id);

  const { data: gastos } = await supabase
    .from("gastos")
    .select("*")
    .eq("cierre_id", cierre.id);

  // const initialData: InitialData = { cierre, ingresos, gastos };

  return (
    <div className="max-w-3xl mx-auto w-full py-10">
      <h1 className="text-2xl font-bold mb-6">Editar cierre</h1>
      <CierreForm
        userId={user.id}
        modo="editar"
        cierreId={cierre.id}
        initialData={{
          cierre: cierre as {
            fecha: string;
            notas: string;
          },
          ingresos: ingresos as {
            tipo: string;
            metodo_pago: string | null;
            cantidad: number;
          }[],
          gastos: gastos as {
            categoria: string;
            cantidad: number;
            detalle: string | null;
          }[],
        }}
      />
    </div>
  );
}
