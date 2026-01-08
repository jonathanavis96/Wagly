import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import AboutUsModal from "./AboutUsModal";

type PolicyKey = "terms" | "privacy" | "refund" | "shipping";

type FooterProps = {
  onOpenContact?: () => void;
  homeHref?: string; // if provided, show "Back to Home"
  showBackToHome?: boolean; // optional toggle
  className?: string; // optional extra classes for footer wrapper
};

const POLICY_TITLES: Record<PolicyKey, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  refund: "Refund Policy",
  shipping: "Shipping Policy",
};

const POLICY_CONTENT: Record<PolicyKey, string> = {
  terms: `These Terms & Conditions (“Instrument”) constitute the complete and exclusive articulation of the understanding between any individual or entity (“User”) and the operator of this platform (“Operator”) with respect to access, interaction, and any transactional engagement facilitated herein.

Engagement with this platform, whether through browsing, communication, or transactional initiation, shall be deemed conclusive evidence of the User’s acknowledgement, assent, and irrevocable acceptance of this Instrument in its entirety, irrespective of whether the User has undertaken a detailed review of its contents.

All goods, services, representations, and related materials made available are furnished strictly on an “as presented,” “as operationally available,” and “with all existing limitations” basis. No assurance, undertaking, or representation—whether express, implied, statutory, customary, or inferred—shall be deemed to arise regarding performance outcomes, suitability, conformity, durability, or expectation alignment.

The Operator disclaims, to the fullest extent permissible by law, any and all liability arising from or connected to the provision, non-provision, delay, alteration, or perceived inadequacy of any product or service, including consequential, derivative, economic, reputational, or non-pecuniary impacts.

The Operator retains the unrestricted right to revise, amend, reinterpret, suspend, or replace any component of this Instrument, product offering, fulfillment methodology, or platform functionality at any time, without notice. Continued engagement constitutes binding acceptance of such modifications.

Any attempt to pursue recourse external to the mechanisms described herein, including but not limited to payment reversals, third-party disputes, or unilateral remedies, may be construed as a material deviation from this Instrument.`,
  privacy: `This Policy governs the handling of information voluntarily or incidentally provided by Users in connection with their interaction with this platform.

Collected information may encompass identifying data, transactional markers, communications metadata, and operational records. Such information is utilised exclusively for internal administrative continuity, fulfillment coordination, compliance obligations, and legitimate operational interests.

Information is maintained using a combination of procedural, technical, and physical safeguards, which may include restricted-access systems, compartmentalised storage environments, and, where operationally appropriate, secure offline retention.

Disclosure of information occurs only insofar as reasonably required for fulfillment, regulatory compliance, legal obligation, or protection of legitimate interests. No personal data is commercially exploited as a standalone asset.

User interaction with the platform constitutes informed consent to the collection, processing, retention, and limited disclosure of information as described herein.`,
  refund: `Any references, descriptions, or characterisations relating to satisfaction, guarantees, returnability, reversibility, or post-transaction remedies—whether presented in policy documentation, marketing materials, checkout interfaces, or other communications—are provided solely for contextual and informational purposes and shall not be interpreted as creating an absolute, automatic, or unconditional entitlement.

The finality of a transaction, once operational processing has commenced, is subject to internal assessment parameters, procedural considerations, and compliance thresholds as determined by the Operator from time to time. Outcomes, where applicable, are evaluated within this framework and are not governed by presumptive timelines or categorical expectations.

Any post-transaction request or inquiry is assessed holistically, taking into account factors including, but not limited to, operational status, fulfillment stage, external dependencies, administrative constraints, and statutory obligations. No single factor shall be determinative.

Administrative, processing, logistical, and third-party costs associated with any transaction are incurred upon initiation and are not ordinarily subject to retroactive adjustment.

This Policy operates in conjunction with, and is subordinate only to, non-derogable statutory requirements where applicable.`,
  shipping: `All delivery-related references provided by the Operator, whether temporal or procedural in nature, are indicative estimates and do not constitute fixed commitments, warranties, or assurances of performance.

Fulfillment processes may be influenced by variables including supplier availability, carrier performance, customs clearance, regulatory intervention, force majeure events, or other factors outside the Operator’s reasonable control.

Transit durations may extend beyond initial projections. In circumstances involving prolonged non-receipt, the Operator may elect, at its discretion and without obligation, to initiate alternative fulfillment measures deemed commercially reasonable under the circumstances.

Such measures, where undertaken, shall be considered a complete administrative response to the matter. No additional remedies shall be implied by their initiation.

The Operator bears no responsibility for delays, misdeliveries, or failures arising from inaccurate information provided by the User or actions of third-party service providers.`,
};

function PolicyModal({
  policy,
  onClose,
}: {
  policy: PolicyKey;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={POLICY_TITLES[policy]}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#F9F6F0] shadow-2xl border border-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-700 hover:bg-white transition shadow-sm border border-black/5"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
            {POLICY_TITLES[policy]}
          </h3>

          <div className="max-h-[70vh] overflow-auto pr-1">
            <pre className="whitespace-pre-wrap text-sm sm:text-base text-gray-700 leading-relaxed">
              {POLICY_CONTENT[policy]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer({
  onOpenContact,
  homeHref,
  showBackToHome,
  className = "",
}: FooterProps) {
  const [openPolicy, setOpenPolicy] = useState<PolicyKey | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  // IMPORTANT: BrowserRouter already applies basename.
  // If you pass "/Wagly/" into <Link to>, you’ll get "/Wagly/Wagly/".
  const backToHomeTo = useMemo(() => {
    const BASE = import.meta.env.BASE_URL || "/"; // e.g. "/Wagly/"
    const baseNoTrailing = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;

    if (!homeHref) return "/";

    // Normalize common "base path" values back to route-root "/"
    if (homeHref === BASE || homeHref === baseNoTrailing) return "/";

    // If someone passes a BASE-prefixed URL, strip the BASE and convert to a route path
    if (homeHref.startsWith(BASE)) {
      const rest = homeHref.slice(BASE.length); // e.g. "bring-wagly-home" or ""
      return "/" + (rest || "");
    }

    if (baseNoTrailing && homeHref.startsWith(baseNoTrailing + "/")) {
      const rest = homeHref.slice((baseNoTrailing + "/").length);
      return "/" + (rest || "");
    }

    // If it's already a route path, keep it
    if (homeHref.startsWith("/")) return homeHref;

    // Otherwise treat as relative route segment
    return "/" + homeHref;
  }, [homeHref]);

  return (
    <>
      <footer
        className={`bg-[#F9F6F0] text-gray-700 py-12 border-t border-black/5 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-extrabold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                {showBackToHome ? (
                  <li>
                    <Link
                      to={backToHomeTo}
                      className="hover:text-[#8A9A5B] transition font-semibold"
                    >
                      Back to Home
                    </Link>
                  </li>
                ) : null}

                {onOpenContact ? (
                  <li>
                    <button
                      type="button"
                      onClick={onOpenContact}
                      className="hover:text-[#8A9A5B] transition font-semibold"
                    >
                      Contact Us
                    </button>
                  </li>
                ) : null}

                <li>
                  <button
                    type="button"
                    onClick={() => setAboutOpen(true)}
                    className="hover:text-[#8A9A5B] transition font-semibold"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 mb-4">Policies</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setOpenPolicy("terms")}
                    className="hover:text-[#8A9A5B] transition font-semibold"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setOpenPolicy("privacy")}
                    className="hover:text-[#8A9A5B] transition font-semibold"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setOpenPolicy("refund")}
                    className="hover:text-[#8A9A5B] transition font-semibold"
                  >
                    Refund Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setOpenPolicy("shipping")}
                    className="hover:text-[#8A9A5B] transition font-semibold"
                  >
                    Shipping Policy
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-700">
                  <span className="font-semibold text-gray-900">Phone:</span> +1
                  (888) 555-0199
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  myhearthsidepets@gmail.com
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 mb-4">
                Secure Payment
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                We process payments securely via Card2Crypto and never store
                card details.
              </p>
            </div>
          </div>

          <div className="border-t border-black/10 pt-8 text-center text-sm text-gray-600">
            <p>
              © 2026 <span className="font-semibold text-gray-900">Wagly</span>.
              All rights reserved. Made with love for families everywhere.
            </p>
          </div>
        </div>
      </footer>

      <AboutUsModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      {openPolicy && (
        <PolicyModal policy={openPolicy} onClose={() => setOpenPolicy(null)} />
      )}
    </>
  );
}
