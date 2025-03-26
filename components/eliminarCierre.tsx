"use client";

export function EliminarCierre({ id }: { id: string }) {
  return (
    <form action={`/protected/cierres/${id}/delete`} method="post">
      <button
        type="submit"
        className="text-sm text-red-600 hover:underline"
        onClick={(e) => {
          if (!confirm("¿Seguro que quieres eliminar este cierre?"))
            e.preventDefault();
        }}
      >
        🗑 Eliminar
      </button>
    </form>
  );
}
