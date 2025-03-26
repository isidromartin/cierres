import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EliminarCierre } from "@/components/eliminarCierre";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: cierres, error } = await supabase
    .from("cierres")
    .select(
      `
      id,
      fecha,
      notas,
      ingresos ( cantidad ),
      gastos ( cantidad )
    `
    )
    .eq("user_id", user.id)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error cargando cierres:", error);
    return <p className="text-red-500">Error al cargar los cierres.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-foreground">
        Cierres recientes
      </h1>

      {cierres.length === 0 && (
        <p className="text-muted-foreground">
          Aún no has registrado ningún cierre.
        </p>
      )}

      {cierres.map((cierre) => {
        const totalIngresos =
          cierre.ingresos?.reduce((sum, i) => sum + (i.cantidad || 0), 0) || 0;
        const totalGastos =
          cierre.gastos?.reduce((sum, g) => sum + (g.cantidad || 0), 0) || 0;
        const beneficio = totalIngresos - totalGastos;

        return (
          <div
            key={cierre.id}
            className="border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition space-y-2"
          >
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                📅{" "}
                {new Date(cierre.fecha).toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span className="text-xs">
                {cierre.notas && `📝 ${cierre.notas}`}
              </span>
            </div>

            <div className="grid grid-cols-3 text-center text-sm font-medium">
              <div className="text-green-500">
                + Ingresos: {totalIngresos.toFixed(2)} €
              </div>
              <div className="text-red-500">
                – Gastos: {totalGastos.toFixed(2)} €
              </div>
              <div
                className={beneficio >= 0 ? "text-green-600" : "text-red-600"}
              >
                = Beneficio: {beneficio.toFixed(2)} €
              </div>
            </div>

            <div className="flex gap-4 mt-2 text-sm">
              <a
                href={`/protected/cierres/${cierre.id}/edit`}
                className="text-blue-600 hover:underline"
              >
                ✏️ Editar
              </a>
              <EliminarCierre id={cierre.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
