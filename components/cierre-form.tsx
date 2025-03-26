"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

type Modo = "crear" | "editar";

export type InitialData = {
  cierre: {
    fecha: string;
    notas: string;
  };
  ingresos: {
    tipo: string;
    metodo_pago: string | null;
    cantidad: number;
  }[];
  gastos: {
    categoria: string;
    cantidad: number;
    detalle: string | null;
  }[];
};

export function CierreForm({
  userId,
  modo = "crear",
  cierreId,
  initialData,
}: {
  userId: string;
  modo?: Modo;
  cierreId?: string;
  initialData?: InitialData;
}) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [fecha, setFecha] = useState("");
  const [notas, setNotas] = useState("");
  const [ingresos, setIngresos] = useState({
    barra_efectivo: "",
    barra_tarjeta: "",
    puerta_efectivo: "",
    puerta_tarjeta: "",
    extra: "",
  });
  const [gastos, setGastos] = useState({
    personal: "",
    comision: "",
    seguridad: "",
    djs: "",
    otros: "",
    detalle_otros: "",
  });

  // Rellenar datos si es modo edición
  useEffect(() => {
    if (modo === "editar" && initialData) {
      setFecha(initialData.cierre.fecha);
      setNotas(initialData.cierre.notas);

      const i = initialData.ingresos.reduce(
        (acc, item) => {
          if (item.tipo === "barra" && item.metodo_pago === "efectivo")
            acc.barra_efectivo = item.cantidad.toString();
          if (item.tipo === "barra" && item.metodo_pago === "tarjeta")
            acc.barra_tarjeta = item.cantidad.toString();
          if (item.tipo === "puerta" && item.metodo_pago === "efectivo")
            acc.puerta_efectivo = item.cantidad.toString();
          if (item.tipo === "puerta" && item.metodo_pago === "tarjeta")
            acc.puerta_tarjeta = item.cantidad.toString();
          if (item.tipo === "extra") acc.extra = item.cantidad.toString();
          return acc;
        },
        { ...ingresos }
      );

      const g = initialData.gastos.reduce(
        (acc, item) => {
          acc[item.categoria as keyof typeof acc] = item.cantidad.toString();
          if (item.categoria === "otros" && item.detalle)
            acc.detalle_otros = item.detalle;
          return acc;
        },
        { ...gastos }
      );

      setIngresos(i);
      setGastos(g);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    let cierre_id = cierreId;

    if (modo === "crear") {
      const { data: cierre, error } = await supabase
        .from("cierres")
        .insert({ fecha, notas, user_id: userId })
        .select()
        .single();

      if (error || !cierre) {
        console.error(error);
        return alert("Error creando cierre");
      }

      cierre_id = cierre.id;
    }

    if (modo === "editar" && cierreId) {
      const { error: updateError } = await supabase
        .from("cierres")
        .update({ fecha, notas })
        .eq("id", cierreId)
        .eq("user_id", userId);

      if (updateError) {
        console.error(updateError);
        return alert("Error actualizando cierre");
      }

      // borrar ingresos/gastos antiguos
      await supabase.from("ingresos").delete().eq("cierre_id", cierreId);
      await supabase.from("gastos").delete().eq("cierre_id", cierreId);
    }

    const ingresosData = [
      {
        tipo: "barra",
        metodo_pago: "efectivo",
        cantidad: +ingresos.barra_efectivo,
      },
      {
        tipo: "barra",
        metodo_pago: "tarjeta",
        cantidad: +ingresos.barra_tarjeta,
      },
      {
        tipo: "puerta",
        metodo_pago: "efectivo",
        cantidad: +ingresos.puerta_efectivo,
      },
      {
        tipo: "puerta",
        metodo_pago: "tarjeta",
        cantidad: +ingresos.puerta_tarjeta,
      },
      { tipo: "extra", metodo_pago: null, cantidad: +ingresos.extra },
    ].filter((i) => i.cantidad > 0);

    const gastosData = [
      { categoria: "personal", cantidad: +gastos.personal },
      { categoria: "comisión", cantidad: +gastos.comision },
      { categoria: "seguridad", cantidad: +gastos.seguridad },
      { categoria: "djs", cantidad: +gastos.djs },
      {
        categoria: "otros",
        cantidad: +gastos.otros,
        detalle: gastos.detalle_otros,
      },
    ].filter((g) => g.cantidad > 0);

    if (ingresosData.length)
      await supabase
        .from("ingresos")
        .insert(ingresosData.map((i) => ({ ...i, cierre_id })));

    if (gastosData.length)
      await supabase
        .from("gastos")
        .insert(gastosData.map((g) => ({ ...g, cierre_id })));

    router.push("/protected/dashboard");
  };

  const Input = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Notas</label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <h2 className="text-lg font-semibold mt-4">Ingresos</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Barra efectivo"
          value={ingresos.barra_efectivo}
          onChange={(v) => setIngresos({ ...ingresos, barra_efectivo: v })}
        />
        <Input
          label="Barra tarjeta"
          value={ingresos.barra_tarjeta}
          onChange={(v) => setIngresos({ ...ingresos, barra_tarjeta: v })}
        />
        <Input
          label="Puerta efectivo"
          value={ingresos.puerta_efectivo}
          onChange={(v) => setIngresos({ ...ingresos, puerta_efectivo: v })}
        />
        <Input
          label="Puerta tarjeta"
          value={ingresos.puerta_tarjeta}
          onChange={(v) => setIngresos({ ...ingresos, puerta_tarjeta: v })}
        />
        <Input
          label="Ingreso extra"
          value={ingresos.extra}
          onChange={(v) => setIngresos({ ...ingresos, extra: v })}
        />
      </div>

      <h2 className="text-lg font-semibold mt-6">Gastos</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Personal"
          value={gastos.personal}
          onChange={(v) => setGastos({ ...gastos, personal: v })}
        />
        <Input
          label="Comisión fiesta"
          value={gastos.comision}
          onChange={(v) => setGastos({ ...gastos, comision: v })}
        />
        <Input
          label="Seguridad"
          value={gastos.seguridad}
          onChange={(v) => setGastos({ ...gastos, seguridad: v })}
        />
        <Input
          label="DJs"
          value={gastos.djs}
          onChange={(v) => setGastos({ ...gastos, djs: v })}
        />
        <Input
          label="Otros gastos"
          value={gastos.otros}
          onChange={(v) => setGastos({ ...gastos, otros: v })}
        />
        <div>
          <label className="block text-sm font-medium mb-1">
            Detalle otros
          </label>
          <input
            type="text"
            value={gastos.detalle_otros}
            onChange={(e) =>
              setGastos({ ...gastos, detalle_otros: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition"
      >
        {modo === "editar" ? "Guardar cambios" : "Guardar cierre"}
      </button>
    </div>
  );
}
