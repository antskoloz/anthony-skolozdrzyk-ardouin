export interface CategoryMeta {
  id: string;
  label: string;
  description: string;
  color: string;
}

export const categories: CategoryMeta[] = [
  {
    id: "fraud",
    label: "Fraud & Security",
    description:
      "The card issuer suspects fraud, blocked the transaction for security reasons, or flagged the card as lost or stolen.",
    color: "#b3261e",
  },
  {
    id: "insufficient-funds",
    label: "Insufficient Funds & Limits",
    description:
      "The cardholder doesn't have enough available balance or credit, or the transaction exceeds a withdrawal/spending limit.",
    color: "#8a5a00",
  },
  {
    id: "technical-processing",
    label: "Technical & Processing Errors",
    description:
      "A system, connectivity, or formatting problem between the merchant, processor, network, and issuer prevented the transaction from completing.",
    color: "#1a5fb4",
  },
  {
    id: "card-issuer-restriction",
    label: "Card & Issuer Restrictions",
    description:
      "The card itself is expired, invalid, or restricted by the issuer for a reason unrelated to funds or suspected fraud.",
    color: "#5e3a8c",
  },
  {
    id: "risk-compliance",
    label: "Risk & Compliance Holds",
    description:
      "The issuer or network is enforcing a risk-management, regulatory, or compliance rule that blocks the transaction.",
    color: "#166534",
  },
  {
    id: "other",
    label: "Other & Uncategorized",
    description:
      "Decline reasons that don't fit neatly into the categories above, or that are scheme-specific edge cases.",
    color: "#4b5563",
  },
];

export function getCategory(id: string): CategoryMeta {
  const found = categories.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category id: ${id}`);
  return found;
}
