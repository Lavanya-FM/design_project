# Fit & Flare Studio - Complete End-to-End System Flow

This document outlines the comprehensive functional architecture of the Fit & Flare Studio platform, serving as the source of truth for all stakeholders.

## 1. Stakeholders & Roles
| Role | Description | Key Responsibilities |
| :--- | :--- | :--- |
| **Customer** | End-user | Customizes blouses, places orders, provides measurements. |
| **Designer** | Creative Creator | Uploads standardized design templates and style constraints. |
| **Tailor** | Fulfillment Partner | Stitches the order, validates measurements, handles alterations. |
| **Merchant** | Fabric Vendor | Manages fabric inventory and fulfills fabric demand. |
| **Admin** | System Overseer | Manages users, pricing, assignments, and platform health. |

## 2. Order Lifecycle (The Core Object)
Every order follows a strict state machine:
1. **Draft**: Customer is customizing (Cart/Wizard).
2. **Locked**: Customer has confirmed design & measurements (Pre-payment).
3. **Placed**: Payment successful. Order ID generated.
4. **Accepted**: Tailor has acknowledged the order.
5. **In Production**: Stitching started.
6. **Quality Check (QC)**: Tailor marks complete; internal validation.
7. **Ready/Shipped**: Dispatched to customer.
8. **Delivered**: Customer received.
9. **Alteration Requested** (Optional): Support flow triggered.
10. **Closed**: Final state.

## 3. Detailed User Flows

### A. Customer Flow
1. **Access**: Login/Guest -> Dashboard/Customizer.
2. **Design**: Select Opening, Neck, Sleeve, Fit, Padding, Fabric, Embellishments.
   - *Data*: Structured selections (not free text).
3. **Measurement**: Enter 8-point metrics (Bust, Waist, etc.) or Standard Size.
   - *Validation*: Checkbox confirmation required.
4. **Reference**: Upload reference image + fabric photo + instructions.
5. **Review**: Lock Design -> Pay -> Track.

### B. Designer Flow
- Upload Templates -> Define Constraints (e.g., "Deep Back not possible with Cotton").
- Categorize styles (Bridal/Everyday).

### C. Merchant Flow
- Maintain Fabric Catalog (Type, Stock, Price).
- Receive "Fabric Demand" signals from Placed orders.

### D. Tailor Flow
- **Assignment**: Receive order -> View Specs & Measurements.
- **Execution**: Update status (Stitching Started) -> Upload Finished Image.
- **QC**: Submit for approval.

### E. Admin Flow
- **Operations**: Assign tailors, Monitor deadlines, Handle refunds.
- **Analytics**: View Revenue, Turnaround Time, Fabric Usage.

## 4. Data Structure Requirements
The system requires the following data points to be persisted:

### Customer Data
- Profile, Addresses, Measurement History (Versioned).

### Design Data
- Base Designs, Option Variants, Compatibility Rules.

### Order Data
- **Snapshot**: Frozen copy of design + measurements at time of order.
- **Financials**: Breakdowns of Base + Add-ons.
- **Logs**: Timestamped status changes.

### Operational Data
- Tailor Assignment (Tailor ID).
- Fabric Allocation (Merchant ID).
- QC Checklists.

## 5. Technical Implementation Status
- **Frontend**: Full flows implemented (Customizer, Checkout, Dashboard, Admin).
- **Database**: PostgreSQL schema defined (needs expanding for Merchants/Fabrics).
- **Backend**: Node.js/Express API (currently using mock logic for demo).
