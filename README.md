# 📸 Glyph — Fast, Simple Image Links (Frontend)

This repository contains the **SvelteKit frontend only** for Glyph, a fast and simple image linking service. The backend is powered by **PocketBase**, which is hosted separately.

Upload an image, and instantly get a shareable (or short) link!

---

## ✨ Features

Glyph is designed for a smooth, owner-scoped image management experience:

- **Email/Password Auth:** Secure authentication implemented against the external **PocketBase** backend.
- **Custom Uploader:** A custom-built **drag & drop** uploader interface (no 3rd-party UI libraries used).
- **Owner-Scoped Gallery:** Users can view only the images they have uploaded.
- **Shareable URLs:** Generates direct, shareable URLs from PocketBase file URLs.
- **Short Links:** Creates concise, memorable links managed via dedicated PocketBase `short_links` records (publicly readable by slug).
- **Modern UI:** Dark, responsive user interface built with **Tailwind CSS** and **DaisyUI**.

### 🚧 Future Enhancements

- Forgot password implementation.

---

## 🧱 Tech Stack

Glyph is a modern web application built on the following technologies:

### Frontend

- **Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [DaisyUI](https://daisyui.com/)

### Backend (External)

- **Service:** [PocketBase](https://pocketbase.io/) (Self-hosted; separate repository/service)

### Deployment & Tooling

- **Deployment:** Railway / Vercel / Netlify (Node adapter recommended)
- **Package Manager:** pnpm (or npm/yarn)

---

## 🔗 Backend (PocketBase) Expectations

The Glyph frontend requires a running PocketBase instance (dev or prod) to function.

### Environment Variable

The frontend needs to know the location of your PocketBase instance. Set the URL in a `.env` file (see below).

### CORS Configuration

Ensure your frontend origin(s) are allowed in your PocketBase instance's **CORS** settings.

### 🗄 Required Collections & Rules

The following two collections with specific fields and access rules are required on the PocketBase backend:

#### 1. `images`

| Field Name       | Type                 | Purpose                                        |
| :--------------- | :------------------- | :--------------------------------------------- |
| `title`          | `text`               | Display title for the image.                   |
| `documents`      | `file`               | The uploaded image file(s).                    |
| `documents_meta` | `json`               | Metadata for the file (e.g., MIME type, size). |
| `user`           | `relation` → `users` | Link to the uploading user.                    |

**Access Rules:**

- **List/Search:** `@request.auth.id != "" && user = @request.auth.id` (Owner only)
- **View:** `@request.auth.id != "" && user = @request.auth.id` (Owner only)
- **Create:** `@request.auth.id != ""` (Authenticated users)
- **Update:** `@request.auth.id != "" && user = @request.auth.id` (Owner only)
- **Delete:** `@request.auth.id != "" && user = @request.auth.id` (Owner only)

#### 2. `short_links`

| Field Name     | Type                 | Purpose                                      |
| :------------- | :------------------- | :------------------------------------------- |
| `slug`         | `text, unique`       | The short, unique identifier for the link.   |
| `target`       | `url/text`           | The full image URL (target of the redirect). |
| `imageDetails` | `json`               | Basic details about the linked image.        |
| `user`         | `relation` → `users` | Link to the creating user.                   |

**Access Rules:**

- **List/Search:** `@request.auth.id != "" || slug != ""` (Authenticated users or public view by slug)
- **View:** `@request.auth.id != "" || slug != ""` (Authenticated users or public view by slug)
- **Create:** `@request.auth.id != ""` (Authenticated users)
- **Update:** `@request.auth.id != "" && user = @request.auth.id` (Owner only)
- **Delete:** `@request.auth.id != "" && user = @request.auth.id` (Owner only)

---

## ⚙️ Environment Variables

Create a file named **`.env`** in the project root to configure the PocketBase URL. SvelteKit automatically exposes variables prefixed with `PUBLIC_` to the client.

env
PB_URL=[https://your-pocketbase.example.com](https://your-pocketbase.example.com)

### Dev example: [http://127.0.0.1:8090](http://127.0.0.1:8090)

---

## 🚀 Run Locally

1.Install dependencies:

`pnpm install # or npm install / yarn install`

2.Set up PocketBase: Ensure your PocketBase instance is running and the `PB_URL` in your .env file points to it.

3.Start the development server:
pnpm dev # or npm run dev

#### Server will typically start at: http://localhost:5173

---

🧪 Scripts

- `npm dev`: Starts the development server.

- `npm build`: Builds the production-ready application.

- `npm preview`: Locally previews the production build.

- `npm lint`: Runs the linter.

---

## 🗂 Project Structure

```
src/
├── lib/
│   ├── assets/
│   ├── components/
│   ├── icons/
│   ├── schema/
│   ├── index.ts
│   ├── type.d.ts
│   └── utils.ts
├── routes/
│   ├── (auth)/        # Auth-related pages (login, register, etc.)
│   ├── [slug]/        # Short-link redirection route
│   ├── api/           # Server routes (if any)
│   └── gallery/       # Authenticated user's image gallery
├── +error.svelte
├── +layout.server.ts
├── +layout.svelte
├── +page.server.ts
├── +page.svelte
├── app.css
├── app.d.ts
├── app.html
└── hooks.server.ts
static/
```

---

## 💖 Shout-Outs & Acknowledgements

- Idea Spark & Mentorship: Ali Afroze

- Railway Deployment Pairing: Raghul

- Built at #Flipopay ❤️

---

## 📄 License

This project is licensed under the MIT License — feel free to use, learn from, and adapt it.

---

## 📬 Contact

Found a bug or have a great idea? Please open an Issue or submit a Pull Request.
