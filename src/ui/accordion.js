import React, { useState } from "react";

export function Accordion({ children, className }) {
  return <div className={`space-y-2 ${className || ""}`}>{children}</div>;
}

export function AccordionItem({ children, className }) {
  return <div className={`border rounded ${className || ""}`}>{children}</div>;
}

export function AccordionTrigger({ children, expandIcon, ...props }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className="flex items-center justify-between cursor-pointer p-2 font-medium bg-gray-100"
      {...props}
    >
      {children}
      <span>{expandIcon || (open ? "−" : "+")}</span>
    </div>
  );
}

export function AccordionContent({ children, className }) {
  return (
    <div className={`p-2 text-gray-600 ${className || ""}`}>{children}</div>
  );
}

export function AccordionSummary(props) {
  return <AccordionTrigger {...props} />;
}

export function AccordionDetails({ children }) {
  return <AccordionContent>{children}</AccordionContent>;
}
