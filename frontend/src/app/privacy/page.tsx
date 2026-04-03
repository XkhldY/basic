import type { Metadata } from "next";
import PrivacyPolicyOnlyClient from "./PrivacyPolicyOnlyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "POM's Privacy Policy explaining how we collect, use, disclose, and safeguard your information when using our Services.",
};

export default function Page() {
  return <PrivacyPolicyOnlyClient />;
}
