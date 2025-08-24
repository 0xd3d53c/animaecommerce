import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy for all products. Items must be in original condition with tags attached. Please contact our customer service team to initiate a return.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days within India. Express shipping is available for 1-2 business days delivery. Free shipping is available on orders above ₹2,000.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we only ship within India. We are working on expanding our shipping to international locations soon.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the 'My Orders' section.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, UPI, net banking, and cash on delivery. All payments are processed securely through Razorpay.",
  },
  {
    question: "How do I know if a product is authentic?",
    answer:
      "All our products are sourced directly from verified suppliers and come with quality guarantees. Each product undergoes quality checks before shipping.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel your order within 24 hours of placing it, provided it hasn't been shipped. Please contact our customer service team for cancellation requests.",
  },
  {
    question: "Do you offer size exchanges?",
    answer:
      "Yes, we offer size exchanges within 7 days of delivery. The product must be unused and in original condition. Exchange shipping charges may apply.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our customer support team via email at support@anima.com, phone at +91-XXXXXXXXXX, or through the contact form on our website. We're available Monday to Saturday, 9 AM to 6 PM.",
  },
  {
    question: "Do you have a physical store?",
    answer:
      "Currently, we operate as an online-only store. However, we are planning to open physical locations in major cities soon.",
  },
]

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, and policies
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
