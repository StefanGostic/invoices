export type Material = {
  id: string;
  "invoice_line/origin": string;
  "invoice_line/name": string;
  "invoice_line/quantity": number;
  "invoice_line/uos_id/name": string;
  "invoice_line/price_unit": number;
  "invoice_line/discount": number;
  "invoice_line/price_subtotal": number;
  selected?: boolean;
};
