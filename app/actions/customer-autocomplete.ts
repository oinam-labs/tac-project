"use server";

import { createClient } from "@/lib/supabase/server";
import type { CustomerSuggestion } from "@/components/invoice/enterprise/invoice-wizard-v2/types";

export async function getRecentCustomers(
  limit: number = 10
): Promise<{ success: boolean; data: CustomerSuggestion[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    // Fetch customers with their invoice count
    const { data: customers, error } = await supabase
      .from("customers")
      .select(`
        id,
        name,
        phone,
        email,
        address,
        city,
        state,
        pincode
      `)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch customers:", error);
      return { success: false, data: [], error: "Failed to fetch customers" };
    }

    const suggestions: CustomerSuggestion[] = (customers || []).map((c) => ({
      id: c.id,
      name: c.name || "",
      phone: c.phone || "",
      email: c.email,
      address: c.address,
      city: c.city,
      state: c.state,
      pincode: c.pincode,
      gstin: null,
      invoiceCount: 0,
    }));

    return { success: true, data: suggestions };
  } catch (error) {
    console.error("Customer autocomplete error:", error);
    return { success: false, data: [], error: "An unexpected error occurred" };
  }
}

export async function searchCustomers(
  query: string,
  limit: number = 5
): Promise<{ success: boolean; data: CustomerSuggestion[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const searchPattern = `%${query}%`;

    const { data: customers, error } = await supabase
      .from("customers")
      .select(`
        id,
        name,
        phone,
        email,
        address,
        city,
        state,
        pincode
      `)
      .or(`name.ilike.${searchPattern},phone.ilike.${searchPattern},email.ilike.${searchPattern}`)
      .order("name", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Failed to search customers:", error);
      return { success: false, data: [], error: "Failed to search customers" };
    }

    const suggestions: CustomerSuggestion[] = (customers || []).map((c) => ({
      id: c.id,
      name: c.name || "",
      phone: c.phone || "",
      email: c.email,
      address: c.address,
      city: c.city,
      state: c.state,
      pincode: c.pincode,
      gstin: null,
      invoiceCount: 0,
    }));

    return { success: true, data: suggestions };
  } catch (error) {
    console.error("Customer search error:", error);
    return { success: false, data: [], error: "An unexpected error occurred" };
  }
}
