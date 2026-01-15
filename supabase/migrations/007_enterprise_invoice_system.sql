-- Migration: Enterprise Invoice System Re-Engineering
-- Description: Complete schema for industry-standard invoice management
-- Reference: IATA, FIATA, ISO 6422, UN/CEFACT, PEPPOL standards

-- =============================================================================
-- INVOICE LINE ITEMS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    
    -- Item Classification
    item_type TEXT NOT NULL CHECK (item_type IN ('freight', 'surcharge', 'service', 'tax', 'discount')),
    
    -- Description
    description TEXT NOT NULL,
    hsn_sac_code TEXT,
    
    -- Quantity & Pricing
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
    unit TEXT DEFAULT 'unit',
    unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    
    -- Discounts
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Tax
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Totals
    line_total DECIMAL(12,2) NOT NULL DEFAULT 0,
    
    -- Ordering
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for line items
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_item_type ON invoice_line_items(item_type);

-- =============================================================================
-- INVOICE PAYMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS invoice_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    
    -- Payment Details
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount DECIMAL(12,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'cheque', 'card', 'upi', 'other')),
    
    -- Reference
    reference_no TEXT,
    transaction_id TEXT,
    
    -- Notes
    notes TEXT,
    
    -- Audit
    recorded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_payment_date ON invoice_payments(payment_date);

-- =============================================================================
-- INVOICE TEMPLATES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS invoice_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Template Info
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL CHECK (template_type IN ('standard', 'express', 'international', 'custom')),
    
    -- Defaults
    default_service_level TEXT DEFAULT 'standard',
    default_payment_terms INTEGER DEFAULT 14,
    default_payment_mode TEXT DEFAULT 'prepaid',
    
    -- Charges Template (JSONB for flexibility)
    default_charges JSONB DEFAULT '{}',
    
    -- Terms
    terms_and_conditions TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Audit
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for templates
CREATE INDEX IF NOT EXISTS idx_invoice_templates_org_id ON invoice_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoice_templates_is_active ON invoice_templates(is_active);

-- =============================================================================
-- INVOICE AUDIT LOG TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS invoice_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    
    -- Action Details
    action TEXT NOT NULL CHECK (action IN (
        'created', 'updated', 'approved', 'sent', 'viewed', 
        'payment_recorded', 'payment_voided', 'cancelled', 
        'status_changed', 'pdf_generated', 'emailed', 'whatsapp_sent'
    )),
    
    -- Change Details
    field_changed TEXT,
    old_value TEXT,
    new_value TEXT,
    
    -- Context
    metadata JSONB DEFAULT '{}',
    
    -- Audit Info
    performed_by UUID REFERENCES auth.users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Indexes for audit log
CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_invoice_id ON invoice_audit_log(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_action ON invoice_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_invoice_audit_log_performed_at ON invoice_audit_log(performed_at);

-- =============================================================================
-- ENHANCED INVOICES TABLE COLUMNS
-- =============================================================================

-- Service & Compliance Fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS service_level TEXT DEFAULT 'standard';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS incoterm TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'INR';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(10,6) DEFAULT 1;

-- GST Compliance
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS hsn_sac_code TEXT DEFAULT '996511';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS place_of_supply TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reverse_charge_applicable BOOLEAN DEFAULT FALSE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS ewaybill_no TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS ewaybill_date DATE;

-- Detailed Charges Breakdown
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS base_freight_charge DECIMAL(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS fuel_surcharge DECIMAL(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS fuel_surcharge_percentage DECIMAL(5,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS remote_area_surcharge DECIMAL(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS security_surcharge DECIMAL(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS peak_season_surcharge DECIMAL(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS residential_delivery_charge DECIMAL(12,2) DEFAULT 0;

-- Weight Details
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS actual_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensional_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS chargeable_weight DECIMAL(10,2);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS dimensional_weight_divisor INTEGER DEFAULT 5000;

-- Payment & Settlement
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'prepaid';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_terms_days INTEGER DEFAULT 14;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS paid_date DATE;

-- Document References
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS purchase_order_no TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS proforma_invoice_id UUID;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS commercial_invoice_id UUID;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES invoice_templates(id);

-- Approval Workflow
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN DEFAULT FALSE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES auth.users(id);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Shipper/Consignor Details (separate from customer)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS shipper_gstin TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS shipper_state_code TEXT;

-- Consignee Additional Fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS consignee_gstin TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS consignee_state_code TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS consignee_country TEXT DEFAULT 'India';

-- Internal Use
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- Notification Tracking
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS sent_via_email_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS email_opens INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;

-- =============================================================================
-- INDEXES FOR NEW COLUMNS
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_invoices_service_level ON invoices(service_level);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_method ON invoices(payment_method);
CREATE INDEX IF NOT EXISTS idx_invoices_place_of_supply ON invoices(place_of_supply);
CREATE INDEX IF NOT EXISTS idx_invoices_ewaybill_no ON invoices(ewaybill_no);
CREATE INDEX IF NOT EXISTS idx_invoices_priority ON invoices(priority);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_tags ON invoices USING GIN(tags);

-- =============================================================================
-- FUNCTIONS FOR AUTO-CALCULATIONS
-- =============================================================================

-- Function to calculate chargeable weight
CREATE OR REPLACE FUNCTION calculate_chargeable_weight(
    actual_wt DECIMAL,
    length_cm DECIMAL,
    width_cm DECIMAL,
    height_cm DECIMAL,
    divisor INTEGER DEFAULT 5000
) RETURNS DECIMAL AS $$
DECLARE
    volumetric_wt DECIMAL;
BEGIN
    IF length_cm IS NOT NULL AND width_cm IS NOT NULL AND height_cm IS NOT NULL THEN
        volumetric_wt := (length_cm * width_cm * height_cm) / divisor;
    ELSE
        volumetric_wt := 0;
    END IF;
    
    RETURN GREATEST(COALESCE(actual_wt, 0), volumetric_wt);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to determine tax type (intra vs inter state)
CREATE OR REPLACE FUNCTION is_interstate_transaction(
    origin_state TEXT,
    destination_state TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN LOWER(TRIM(origin_state)) != LOWER(TRIM(destination_state));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update invoice totals from line items
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
    new_subtotal DECIMAL;
    new_tax DECIMAL;
    new_total DECIMAL;
BEGIN
    -- Calculate subtotal from line items
    SELECT 
        COALESCE(SUM(line_total), 0),
        COALESCE(SUM(tax_amount), 0)
    INTO new_subtotal, new_tax
    FROM invoice_line_items
    WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
    
    -- Update invoice
    UPDATE invoices
    SET 
        subtotal = new_subtotal,
        total_tax = new_tax,
        total_amount = new_subtotal + new_tax,
        balance_due = (new_subtotal + new_tax) - COALESCE(paid_amount, 0),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating invoice totals
DROP TRIGGER IF EXISTS trigger_update_invoice_totals ON invoice_line_items;
CREATE TRIGGER trigger_update_invoice_totals
    AFTER INSERT OR UPDATE OR DELETE ON invoice_line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_totals();

-- Function to update paid amount from payments
CREATE OR REPLACE FUNCTION update_invoice_paid_amount()
RETURNS TRIGGER AS $$
DECLARE
    total_paid DECIMAL;
BEGIN
    SELECT COALESCE(SUM(amount), 0)
    INTO total_paid
    FROM invoice_payments
    WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
    
    UPDATE invoices
    SET 
        paid_amount = total_paid,
        balance_due = total_amount - total_paid,
        status = CASE 
            WHEN total_paid >= total_amount THEN 'paid'
            WHEN total_paid > 0 THEN 'partial'
            ELSE status
        END,
        paid_date = CASE 
            WHEN total_paid >= total_amount THEN CURRENT_DATE
            ELSE paid_date
        END,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating paid amount
DROP TRIGGER IF EXISTS trigger_update_invoice_paid_amount ON invoice_payments;
CREATE TRIGGER trigger_update_invoice_paid_amount
    AFTER INSERT OR UPDATE OR DELETE ON invoice_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_paid_amount();

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_audit_log ENABLE ROW LEVEL SECURITY;

-- Line Items Policies
CREATE POLICY "Users can view line items for their invoices"
    ON invoice_line_items FOR SELECT
    USING (
        invoice_id IN (
            SELECT id FROM invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM profiles WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage line items for their invoices"
    ON invoice_line_items FOR ALL
    USING (
        invoice_id IN (
            SELECT id FROM invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM profiles WHERE id = auth.uid()
            )
        )
    );

-- Payments Policies
CREATE POLICY "Users can view payments for their invoices"
    ON invoice_payments FOR SELECT
    USING (
        invoice_id IN (
            SELECT id FROM invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM profiles WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage payments for their invoices"
    ON invoice_payments FOR ALL
    USING (
        invoice_id IN (
            SELECT id FROM invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM profiles WHERE id = auth.uid()
            )
        )
    );

-- Templates Policies
CREATE POLICY "Users can view templates in their organization"
    ON invoice_templates FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage templates"
    ON invoice_templates FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Audit Log Policies
CREATE POLICY "Users can view audit log for their invoices"
    ON invoice_audit_log FOR SELECT
    USING (
        invoice_id IN (
            SELECT id FROM invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM profiles WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "System can insert audit log"
    ON invoice_audit_log FOR INSERT
    WITH CHECK (true);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE invoice_line_items IS 'Individual line items for invoices supporting detailed breakdowns';
COMMENT ON TABLE invoice_payments IS 'Payment records for invoices with full audit trail';
COMMENT ON TABLE invoice_templates IS 'Reusable templates for quick invoice generation';
COMMENT ON TABLE invoice_audit_log IS 'Complete audit trail of all invoice operations';

COMMENT ON COLUMN invoices.service_level IS 'Service tier: express, priority, economy, standard';
COMMENT ON COLUMN invoices.incoterm IS 'International Commercial Terms for trade';
COMMENT ON COLUMN invoices.hsn_sac_code IS 'Harmonized System Code for GST compliance';
COMMENT ON COLUMN invoices.place_of_supply IS 'Place of supply for GST determination';
COMMENT ON COLUMN invoices.ewaybill_no IS 'E-Way Bill number for goods transport';
COMMENT ON COLUMN invoices.dimensional_weight_divisor IS '5000 for air, 6000 for surface';
