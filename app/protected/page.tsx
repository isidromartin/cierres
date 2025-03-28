import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Obtener cierres del usuario con ingresos y gastos
  const { data: cierres, error } = await supabase
    .from("cierres")
    .select(
      `
      id,
      fecha,
      ingresos ( cantidad ),
      gastos ( cantidad )
    `
    )
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return <p className="text-red-500">Error cargando estadísticas.</p>;
  }

  const totalCierres = cierres.length;

  const totalIngresos = cierres.reduce((acc, cierre) => {
    return (
      acc + (cierre.ingresos?.reduce((s, i) => s + (i.cantidad || 0), 0) || 0)
    );
  }, 0);

  const totalGastos = cierres.reduce((acc, cierre) => {
    return (
      acc + (cierre.gastos?.reduce((s, g) => s + (g.cantidad || 0), 0) || 0)
    );
  }, 0);

  const beneficio = totalIngresos - totalGastos;
  const ultimoCierre = cierres
    .map((c) => new Date(c.fecha))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Resumen general
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div className="bg-card p-4 rounded shadow border border-border">
          <div className="text-xs text-muted-foreground mb-1">
            Cierres totales
          </div>
          <div className="text-xl font-bold text-foreground">
            {totalCierres}
          </div>
        </div>
        <div className="bg-card p-4 rounded shadow border border-border">
          <div className="text-xs text-muted-foreground mb-1">
            Total ingresos
          </div>
          <div className="text-xl font-bold text-green-600">
            {totalIngresos.toFixed(2)} €
          </div>
        </div>
        <div className="bg-card p-4 rounded shadow border border-border">
          <div className="text-xs text-muted-foreground mb-1">Total gastos</div>
          <div className="text-xl font-bold text-red-500">
            {totalGastos.toFixed(2)} €
          </div>
        </div>
        <div className="bg-card p-4 rounded shadow border border-border col-span-1 md:col-span-full lg:col-span-full">
          <div className="text-xs text-muted-foreground mb-1">
            Beneficio neto
          </div>
          <div
            className={`text-xl font-bold ${
              beneficio >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {beneficio.toFixed(2)} €
          </div>
        </div>
        {ultimoCierre && (
          <div className="bg-card p-4 rounded shadow border border-border col-span-full">
            <div className="text-xs text-muted-foreground mb-1">
              Último cierre
            </div>
            <div className="text-sm font-medium text-foreground">
              {ultimoCierre.toLocaleDateString("es-ES", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
