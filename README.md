# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Cloudinary (Resumes) setup

This project uses Cloudinary to store student uploaded resumes. Configure the following environment variables in your Vite environment (for example, in a `.env` file at project root):

- `VITE_CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET` — an unsigned upload preset name (recommended for client-side uploads)

Example `.env` entries:

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

Notes:
- Keep the upload preset restricted and monitor uploads. Using an unsigned preset is simpler for client-side uploads; do not expose your Cloudinary API secret in client code.
- The resume upload UI accepts PDF, DOC and DOCX files and enforces a 3 MB per-file limit and a maximum of 3 files per user.
