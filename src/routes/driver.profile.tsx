import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "@/components/profile-screen";

export const Route = createFileRoute("/driver/profile")({
  component: () => <ProfileScreen role="driver" />,
});
