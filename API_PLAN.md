# API Plan

## Feature #1 – Bi-Directional Contact Sync

### Wix APIs

Used for:

* Contact management
* Contact retrieval
* Contact updates

Purpose:

* Create and update Wix contacts
* Synchronize contact information

---

### HubSpot Contacts API

Used for:

* Contact creation
* Contact updates
* Contact retrieval

Endpoints:

* CRM Contacts API
* Contact Properties API

Purpose:

* Synchronize contact data between systems

---

### HubSpot Webhooks API

Used for:

* HubSpot → Wix updates

Purpose:

* Receive contact change notifications
* Trigger synchronization

---

## Feature #2 – Form & Lead Capture

### Wix Forms

Used for:

* Lead collection

Captured fields:

* Email
* First Name
* Last Name
* Custom Fields

Additional Metadata:

* UTM Source
* UTM Medium
* UTM Campaign
* UTM Term
* UTM Content
* Page URL
* Referrer
* Timestamp

---

### HubSpot CRM API

Used for:

* Lead creation
* Lead updates

Purpose:

* Store marketing attribution data
* Maintain lead history

---

## Data Persistence

### Integration

Stores:

* HubSpot Portal ID
* Access Token
* Refresh Token

### Contact Mapping

Stores:

* Wix Contact ID
* HubSpot Contact ID

### Field Mapping

Stores:

* Wix Field
* HubSpot Property
* Sync Direction

### Sync Log

Stores:

* Sync ID
* Source
* Action
* Status
