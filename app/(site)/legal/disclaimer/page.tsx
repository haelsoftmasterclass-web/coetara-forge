import LegalPage from "@/components/LegalPage";
import { disclaimer } from "@/content/faq";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({ title: "Investment / Legal Disclaimer", description: "Investment and legal disclaimer for Coetara Forge.", path: routes.disclaimer });

export default function Disclaimer() {
  return (
    <LegalPage title="Investment / Legal Disclaimer">
      <p>{disclaimer}</p>
      <p>Nothing on this website is an offer of investment, an offer to buy or sell securities, or financial, legal or tax advice.</p>
    </LegalPage>
  );
}
