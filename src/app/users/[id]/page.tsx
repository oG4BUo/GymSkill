import { UserProfile } from "@/components/users/user-profile";

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserProfile id={id} />;
}
