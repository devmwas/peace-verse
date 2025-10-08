import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, HelpCircle, ChevronDown } from "lucide-react";

// ✅ shadcn components (accordion, card, etc.)
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const faqs = [
  {
    q: "How do I vote on a poll?",
    a: "Navigate to the Polling page, select a bill or issue, and click on your preferred choice to cast your vote.",
  },
  {
    q: "How can I propose a new bill or issue?",
    a: "Click the 'Propose a Bill' button on the homepage or Polling page. Fill out the form with details and submit.",
  },
  {
    q: "What is the Hall of Fame?",
    a: "The Hall of Fame recognizes peacebuilders who contribute positively on social platforms, blogs, and community activities.",
  },
  {
    q: "How are Safe Spaces verified?",
    a: "Safe Spaces posted by users go through a review process to ensure credibility and alignment with our peace mission.",
  },
  {
    q: "How do I disable location tracking?",
    a: "You can disable location permissions in your browser or device settings. The platform will still function without it.",
  },
];

const Help = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <HelpCircle className="w-12 h-12 mx-auto text-blue-500 mb-2" />
        <h2 className="text-3xl font-bold">Help & Support</h2>
        <p className="text-gray-600">
          Find answers to common questions and get in touch with our team.
        </p>
      </motion.div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="text-blue-500" />
            <span>Email: support@peaceverse.or.ke</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="text-green-500" />
            <span>Phone: +254 700 123 456</span>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pt-8">
        Peace Verse © 2025. A youth-led peacebuilding platform for Kenya.
      </footer>
    </div>
  );
};

export default Help;
