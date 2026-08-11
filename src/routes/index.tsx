import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Pains } from "@/components/landing/Pains";
import { Services } from "@/components/landing/Services";
import { Process } from "@/components/landing/Process";
import { Roi } from "@/components/landing/Roi";
import { UseCases } from "@/components/landing/UseCases";
import { Pricing } from "@/components/landing/Pricing";
import { Faq, faqs } from "@/components/landing/Faq";
import { LeadForm } from "@/components/landing/LeadForm";
import { Footer } from "@/components/landing/Footer";

const title = "Chatbot ishlab chiqish O‘zbekistonda | Telegram va sayt botlari";
const description = "Biznes uchun individual Telegram va veb-sayt chatbotlari: 24/7 javob, lidlarni saralash, buyurtma va navbat avtomatlashtirish, CRM integratsiyasi. Narxlar so‘mda.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }],
  }),
});
function Index() { return <div className="min-h-screen bg-background"><Navbar/><main><Hero/><Pains/><Services/><Process/><Roi/><UseCases/><Pricing/><Faq/><LeadForm/></main><Footer/></div>; }
