# MAXTROIT DOWNLOAD HUB

Mobile-first starter website for the MAXTROIT DOWNLOAD HUB project.

## Current starter features
- Responsive dark navy / blue / purple design
- Home page with upload cards, search and category filter
- Admin form to add and delete download entries
- Download page with a short visible countdown
- Older entries remain in the list

## Important limitations — not production-ready
This first GitHub version uses **localStorage**. Entries exist only in the browser/device where they were created. The admin page is not protected and must not be treated as a secure admin system. The timer is a user-experience delay, not security or proof of a real download. Never put private keys or passwords in frontend code.

## Next development stage
1. Add Firebase Authentication with a server-verified admin UID.
2. Move entries to Firestore and use restrictive security rules.
3. Add image uploads using Firebase Storage with file validation.
4. Add editable entries, configurable timer steps, optional social links, theme controls and analytics.
5. Test on Android browsers and deploy with HTTPS.

## Run locally
Open `index.html` in a modern browser. For full testing, serve the folder using a local static web server.
