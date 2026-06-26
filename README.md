# HubSync – Wix ↔ HubSpot Integration

## Overview

HubSync is a Wix application that enables secure integration between Wix and HubSpot CRM.

The application allows:

* OAuth 2.0 HubSpot connection
* Bi-directional contact synchronization
* Contact mapping management
* Lead capture from Wix forms
* UTM attribution tracking
* Secure token storage and refresh
* Sync logging and audit trail

---

## Features

### Feature #1 – Bi-Directional Contact Sync

* Wix → HubSpot contact creation
* Wix → HubSpot contact updates
* HubSpot webhook processing
* Contact mapping persistence
* Field mapping configuration
* Sync logging
* Token refresh support

### Feature #2 – Form & Lead Capture

* Lead creation in HubSpot
* UTM Source tracking
* UTM Medium tracking
* UTM Campaign tracking
* UTM Term tracking
* UTM Content tracking
* Page URL tracking
* Referrer tracking
* Timestamp tracking

---

## Tech Stack

### Frontend

* Wix CLI App
* Astro
* React
* Wix Design System

### Backend

* Node.js
* Express
* Prisma
* PostgreSQL (Neon)

### Integrations

* HubSpot OAuth API
* HubSpot CRM Contacts API
* HubSpot Webhooks API

---

## Setup

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
npm install
npx prisma generate
npm run dev
```

### Environment Variables

```env
DATABASE_URL=

HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
HUBSPOT_REDIRECT_URI=
```

---

## Security

* OAuth 2.0 authentication
* Access tokens never exposed to frontend
* Refresh token support
* Secure database storage
* Least privilege HubSpot scopes

---

## Status

Assignment implementation completed with contact synchronization, lead capture, field mapping, OAuth connection, token refresh and attribution tracking.
