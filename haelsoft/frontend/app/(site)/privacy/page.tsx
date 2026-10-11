import PageHero from "@/components/PageHero";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy notice",
  description: "How Haelsoft EdTech handles the personal information you send through this website.",
  path: routes.privacy,
});

/**
 * Supporting page linked from the contact form's consent notice. It describes what
 * this website actually does with enquiry data. It must be reviewed by Haelsoft's
 * legal adviser (and the data controller's details added) before launch.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy notice"
        lede={<p>How we handle the information you send us through this website.</p>}
        crumbs={[{ label: "Privacy notice", href: routes.privacy }]}
      />
      <section className="section bg-paper">
        <div className="wrap">
          <div className="prose-brand grid gap-2">
            <p className="card bg-sand p-5 text-[15px]">
              <strong>Draft for review.</strong> This notice describes how the website handles enquiries today. It is awaiting
              legal review and will be updated with Haelsoft&apos;s full company details.
            </p>
            <h2 className="heading mt-8 text-[26px]">What we collect</h2>
            <p>
              When you use the contact form we collect your enquiry type, name, email address, country, subject and message, and
              your phone number if you choose to give it. We also record that you agreed to this notice and the time you sent the
              message.
            </p>
            <h2 className="heading mt-8 text-[26px]">How we use it</h2>
            <p>
              We use these details only to respond to your enquiry and to keep a record of our conversation. We don&apos;t sell your
              information or use it for advertising.
            </p>
            <h2 className="heading mt-8 text-[26px]">Who can see it</h2>
            <p>
              Enquiries are stored in our database and can only be viewed by authorised Haelsoft staff. Staff may receive an email
              alert that a new enquiry has arrived; the alert does not contain your message.
            </p>
            <h2 className="heading mt-8 text-[26px]">Your choices</h2>
            <p>You can ask us to see, correct or delete the information you sent us by sending a message through the contact form.</p>
            <h2 className="heading mt-8 text-[26px]">Cookies</h2>
            <p>This website does not set advertising or analytics cookies.</p>
          </div>
        </div>
      </section>
    </>
  );
}
