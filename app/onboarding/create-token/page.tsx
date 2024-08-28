import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { SubHeading } from "~/components/ui/subheading";
import { Trans } from "~/components/ui/trans";

export default function CreateTokenPage() {
  return (
    <div className="flex w-full flex-1 flex-col space-y-8">
      <div className="flex flex-col items-center space-y-2">
        <Heading type={1}>
          <Trans i18nKey="onboarding:createToken.heading" />
        </Heading>

        <SubHeading className="text-base">
          <Trans i18nKey="onboarding:createToken.subHeading" />
        </SubHeading>
      </div>

      <Button>
        <Trans i18nKey="onboarding:createToken.heading" />
      </Button>
    </div>
  );
}
