import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex gap-4 text-sm font-medium">
        <Link href="/protected" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/protected/cierres" className="hover:underline">
          Cierres
        </Link>
        <Link href="/protected/cierres/new" className="hover:underline">
          Nuevo cierre
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          Hey, {user.email}!
        </span>
        <form action={signOutAction}>
          <Button type="submit" size="sm" variant="outline">
            Cerrar sesión
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}
