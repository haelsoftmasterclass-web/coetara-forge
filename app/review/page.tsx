import type { Metadata } from "next";
import ReviewApp from "@/components/review/ReviewApp";

export const metadata: Metadata = {
  title: "Review dashboard",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return <ReviewApp />;
}
