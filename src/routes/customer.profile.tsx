import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/components/profile-screen";

export const Route = createFileRoute("/customer/profile")({
  component: () => <ProfileScreen role="customer" />,
});
