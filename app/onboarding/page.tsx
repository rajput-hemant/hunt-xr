import { redirect } from "next/navigation";

import { auth } from "~/lib/auth";

import { OnboardingContainer } from "./_components/onboarding-container";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <OnboardingContainer session={session} />;
}
