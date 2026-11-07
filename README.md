# MAXTROIT DOWNLOAD HUB

Mobile-first download website with separate public and admin panels.

## Panels
- Public user panel: `index.html` — search, categories and download cards. It has no admin link.
- Admin panel: `admin.html` — Firebase email/password login; the configured admin UID is checked in the page and enforced again by Firestore Security Rules.
- Download page: `download.html?id=DOCUMENT_ID`.

## Firebase setup (required for shared data and secure admin writes)
1. Create a Firebase project at https://console.firebase.google.com/ and register a Web App.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create your admin user under **Authentication → Users**. Do not send its password to anyone.
4. Create a **Cloud Firestore** database.
5. Open the admin user's Authentication details and copy its UID.
6. Edit `firebase-config.js`: replace the sample values with the Web App config and replace `PASTE_ADMIN_UID` with the admin UID.
7. In Firestore → Rules, publish the contents of `firestore.rules`, replacing its `PASTE_ADMIN_UID` with the same UID.
8. Deploy the website over HTTPS (for example, GitHub Pages).

The Firebase web config is intended to be present in frontend code. Never add service-account JSON, private keys, or passwords to this repository.

## Data model
Collection: `downloads`. Each document contains:
`title`, `description`, `category`, `thumbnail`, `url`, `created`.

Firestore rules allow public reads so visitors can see downloads. Only the configured authenticated UID can create, edit, or delete download documents. The admin panel also checks the UID, but **the Firestore rules are the actual security boundary**.

## Current limitations
- Firebase is not connected until the setup above is completed.
- Image fields currently accept image URLs; direct image upload/storage UI is not implemented.
- Download page has a visible 5-second wait; it is a presentation delay, not a security control.
- Admin can add, edit and delete download records after Firebase setup.
- This project has not yet been browser/device QA tested or deployed.
