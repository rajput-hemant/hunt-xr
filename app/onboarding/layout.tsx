import Image from "next/image";

import { siteConfig } from "~/config/site";

export default function OnboardingLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="flex h-screen flex-1 flex-col py-8 dark:bg-background">
      <div className="hidden justify-between px-8 lg:flex">
        <Image
          src="/logo-sm.png"
          width={100}
          height={100}
          alt={`${siteConfig.name} logo`}
        />
      </div>

      <div className="mx-auto flex w-10/12 flex-1 flex-col items-center justify-center lg:w-8/12 xl:max-w-2xl">
        <div className="flex w-full flex-col space-y-16 duration-1000 ease-out animate-in fade-in zoom-in-95 slide-in-from-bottom-24 lg:rounded-md lg:p-16">
          {children}
        </div>
      </div>
    </div>
  );
}
