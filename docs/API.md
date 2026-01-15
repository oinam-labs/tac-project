# TAC Cargo API Documentation

## Overview

TAC Cargo uses **Server Actions** as the primary API layer, following Next.js 14+ best practices. All mutations go through server actions for security and type safety.

## Authentication

All server actions require authentication via Supabase Auth. The user's session is automatically validated using cookies.

```typescript
// All actions check authentication first
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  return error("Unauthorized", "UNAUTHORIZED");
}
```

## Response Format

All server actions return a standardized `ActionResult<T>` type:

```typescript
type ActionResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: ActionErrorCode };

type ActionErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "DATABASE_ERROR"
  | "EXTERNAL_SERVICE_ERROR";
```

---

## Shipments API

### Create Shipment

```typescript
import { createShipment } from "@/app/actions/shipments";

const result = await createShipment({
  transport_mode: "surface" | "air" | "express" | "economy",
  pieces: number,
  consignee_name: string,
  consignee_phone: string,      // 10-15 chars
  consignee_address: string,    // min 5 chars
  consignee_city: string,
  consignee_state: string,
  consignee_pincode: string,
  // Optional fields
  customer_id?: string,         // UUID
  reference?: string,
  origin_warehouse_id?: string,
  destination_warehouse_id?: string,
  weight_kg?: number,
  consignee_email?: string,
  declared_value?: number,
  notes?: string,
});
```

**Returns:** `ActionResult<Shipment>`

### Update Shipment Status

```typescript
import { updateShipmentStatus } from "@/app/actions/shipments";

const result = await updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  description?: string
);
```

**Valid Status Values:**
- `booked` - Initial booking
- `picked_up` - Picked up from sender
- `at_origin_hub` - At origin warehouse
- `in_transit` - Moving between hubs
- `at_destination_hub` - At destination warehouse
- `out_for_delivery` - With delivery agent
- `delivered` - Successfully delivered
- `exception` - Delivery exception
- `returned` - Returned to sender
- `cancelled` - Shipment cancelled

### Cancel Shipment

```typescript
import { cancelShipment } from "@/app/actions/shipments";

const result = await cancelShipment(shipmentId: string);
```

### Search Shipments

```typescript
import { searchShipments } from "@/app/actions/shipments";

const result = await searchShipments(
  query: string,
  status?: ShipmentStatus
);
```

### Bulk Operations

```typescript
import { bulkUpdateStatus, bulkAssignToManifest, bulkDelete } from "@/app/actions/shipments";

// Bulk status update
const result = await bulkUpdateStatus(
  shipmentIds: string[],
  status: ShipmentStatus
);

// Bulk manifest assignment
const result = await bulkAssignToManifest(
  shipmentIds: string[],
  manifestId: string
);

// Bulk delete (soft delete)
const result = await bulkDelete(shipmentIds: string[]);
```

---

## Manifests API

### Create Manifest

```typescript
import { createManifest } from "@/app/actions/manifests";

const result = await createManifest({
  manifest_number: string,      // Format: MNF-XXXXX
  origin_warehouse_id: string,
  destination_warehouse_id: string,
  transport_mode: "air" | "surface" | "express" | "economy",
  planned_departure: string,    // ISO datetime
  planned_arrival: string,      // ISO datetime
  // Optional
  vehicle_number?: string,
  driver_name?: string,
  driver_phone?: string,
  seal_number?: string,
});
```

### Manifest Lifecycle

```typescript
import { 
  lockManifest,
  dispatchManifest,
  arriveManifest,
  completeManifest,
  unlockManifest
} from "@/app/actions/manifests";

// Lock manifest (no more shipments can be added)
await lockManifest(manifestId);

// Dispatch (sets all shipments to in_transit)
await dispatchManifest(manifestId);

// Mark as arrived at destination
await arriveManifest(manifestId);

// Complete manifest
await completeManifest(manifestId);

// Unlock (only if locked, not dispatched)
await unlockManifest(manifestId);
```

### Add/Remove Shipments

```typescript
import { addShipmentToManifest, removeShipmentFromManifest } from "@/app/actions/manifests";

// Add by reference (validates route match)
await addShipmentToManifest(manifestId, shipmentReference);

// Remove from manifest
await removeShipmentFromManifest(manifestId, shipmentId);
```

---

## Invoices API

### Generate Label Invoice

```typescript
import { generateLabelInvoice } from "@/app/actions/invoices";

const result = await generateLabelInvoice({
  shipmentId: string
});
```

### Generate Customer Invoice

```typescript
import { generateCustomerInvoice } from "@/app/actions/invoices";

const result = await generateCustomerInvoice({
  shipmentId: string,
  items: Array<{
    description: string,
    quantity: number,
    unitPrice: number,
    taxRate?: number,
  }>,
  dueDate?: string,
  notes?: string,
});
```

### Invoice Status Management

```typescript
import { 
  markInvoiceAsSent,
  regenerateInvoice
} from "@/app/actions/invoices";

// Mark as sent via channel
await markInvoiceAsSent(invoiceId, "whatsapp" | "email");

// Regenerate PDF
await regenerateInvoice(invoiceId);
```

---

## Customers API

### Create Customer

```typescript
import { createCustomer } from "@/app/actions/customer-crud";

const result = await createCustomer({
  name: string,
  contact_person: string,
  contact_email: string,
  contact_phone: string,
  billing_address: string,
  city: string,
  state: string,
  pincode: string,        // 6 digits
  gst_number?: string,    // Valid GST format
  credit_limit?: number,
});
```

---

## Tracking API

### Get Tracking Info

```typescript
import { getTrackingInfo } from "@/app/actions/tracking";

const result = await getTrackingInfo(reference: string);
```

**Returns:** Shipment details with tracking events timeline.

### Mark as Delivered

```typescript
import { markAsDelivered } from "@/app/actions/tracking";

const result = await markAsDelivered(
  shipmentId: string,
  deliveryNotes?: string
);
```

---

## Error Handling

### Client-Side Usage

```typescript
import { toast } from "sonner";

const result = await createShipment(formData);

if (result.success) {
  toast.success(result.message || "Shipment created");
  // Handle success
} else {
  toast.error(result.error);
  
  // Handle specific error codes
  switch (result.code) {
    case "VALIDATION_ERROR":
      // Show field-level errors
      break;
    case "CONFLICT":
      // Resource already exists
      break;
    case "NOT_FOUND":
      // Resource not found
      break;
    case "UNAUTHORIZED":
      // Redirect to login
      break;
  }
}
```

---

## Rate Limiting

Server actions are protected against abuse through:
- Supabase RLS policies (organization-scoped)
- Request validation via Zod schemas
- Automatic audit logging

---

## Webhooks

TAC Cargo supports webhooks for external integrations. Configure in Settings → Integrations.

**Supported Events:**
- `shipment.created`
- `shipment.status_changed`
- `shipment.delivered`
- `invoice.created`
- `invoice.paid`
- `manifest.dispatched`

---

## Best Practices

1. **Always check `result.success`** before accessing data
2. **Use the provided error codes** for specific handling
3. **Validate forms client-side** with Zod schemas before submission
4. **Handle loading states** using React transitions
5. **Optimistic updates** can be implemented but require rollback logic

```typescript
const [isPending, startTransition] = useTransition();

const handleSubmit = (data) => {
  startTransition(async () => {
    const result = await createShipment(data);
    if (!result.success) {
      toast.error(result.error);
    }
  });
};
```
