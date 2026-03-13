import ProfileUI from "@/components/profiles/core/profileUi";

export const metadata = {
  title: "Your Profile",
  description: "View and manage your profile.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-lg mx-auto mb-8">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight font-mono">
          Profile
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Manage your account details and role.
        </p>
      </div>

      <ProfileUI />
    </main>
  );
}
