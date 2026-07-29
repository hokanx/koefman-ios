/**
 * Hand-written types mirroring /docs/schema.sql.
 *
 * Once the Supabase project is live, prefer regenerating this file with the
 * Supabase CLI (`supabase gen types typescript --project-id <id>`) so it can
 * never drift from the real schema. Kept hand-written for Phase 1 since no
 * live project is wired into this session.
 */

export type CustomerType = 'private' | 'business';
export type OfferStatus = 'draft' | 'sent' | 'signed' | 'rejected';
export type InvoiceStatus = 'open' | 'paid' | 'overdue' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  id: string;
  user_id: string;
  business_name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  tax_number: string | null;
  vat_id: string | null;
  logo_url: string | null;
  brand_primary_color: string;
  brand_accent_color: string;
  pdf_footer_note: string | null;
  currency: string;
  default_tax_rate: number;
  payment_terms: string | null;
  offer_number_prefix: string;
  invoice_number_prefix: string;
  next_offer_seq: number;
  next_invoice_seq: number;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  customer_type: CustomerType;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  vehicle_plate: string | null;
  vehicle_brand: string | null;
  vehicle_model: string | null;
  repair_notes: string | null;
  property_size: string | null;
  cleaning_frequency: string | null;
  service_location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  user_id: string;
  offer_number: string;
  customer_id: string;
  date: string;
  status: OfferStatus;
  notes: string | null;
  internal_notes: string | null;
  subtotal: number;
  tax_total: number;
  grand_total: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface OfferItem {
  id: string;
  user_id: string;
  offer_id: string;
  title: string;
  description: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OfferAcceptance {
  id: string;
  user_id: string;
  offer_id: string;
  signature_image: string;
  signature_text: string | null;
  signer_name: string;
  signed_at: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  customer_id: string;
  source_offer_id: string | null;
  date: string;
  due_date: string;
  status: InvoiceStatus;
  paid_at: string | null;
  notes: string | null;
  subtotal: number;
  tax_total: number;
  grand_total: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  user_id: string;
  invoice_id: string;
  title: string;
  description: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Minimal `Database` shape — just enough for a typed `supabase.from(...)` client. */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; email: string }; Update: Partial<Profile> };
      business_settings: {
        Row: BusinessSettings;
        Insert: Partial<BusinessSettings> & { user_id: string };
        Update: Partial<BusinessSettings>;
      };
      customers: {
        Row: Customer;
        Insert: Partial<Customer> & { user_id: string; name: string };
        Update: Partial<Customer>;
      };
      offers: {
        Row: Offer;
        Insert: Partial<Offer> & { user_id: string; offer_number: string; customer_id: string };
        Update: Partial<Offer>;
      };
      offer_items: {
        Row: OfferItem;
        Insert: Partial<OfferItem> & { user_id: string; offer_id: string; title: string };
        Update: Partial<OfferItem>;
      };
      offer_acceptances: {
        Row: OfferAcceptance;
        Insert: Partial<OfferAcceptance> & {
          user_id: string;
          offer_id: string;
          signature_image: string;
          signer_name: string;
        };
        Update: Partial<OfferAcceptance>;
      };
      invoices: {
        Row: Invoice;
        Insert: Partial<Invoice> & { user_id: string; invoice_number: string; customer_id: string };
        Update: Partial<Invoice>;
      };
      invoice_items: {
        Row: InvoiceItem;
        Insert: Partial<InvoiceItem> & { user_id: string; invoice_id: string; title: string };
        Update: Partial<InvoiceItem>;
      };
    };
  };
}
