import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, dob")
      .eq("id", data.user.id)
      .maybeSingle();

    const onboarded = Boolean(profile?.name && profile?.dob);
    if (!onboarded && location.pathname !== "/onboarding") {
      throw redirect({ to: "/onboarding" });
    }
    if (onboarded && location.pathname === "/onboarding") {
      throw redirect({ to: "/home" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
