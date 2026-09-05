import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// `@testing-library/react`'s auto-cleanup only self-registers when `afterEach`
// is a global (see its `dist/index.js`: `if (typeof afterEach === "function")`).
// This project doesn't set `test.globals: true` (every test file explicitly
// imports `describe`/`it`/`expect` from "vitest"), so without this the DOM
// from one test's `render()` leaks into the next test in the same file.
afterEach(cleanup);

// `next.config.ts` sets `trailingSlash: true`. In a real Next.js build this is
// baked into `next/link` via a bundler DefinePlugin constant
// (`process.env.__NEXT_TRAILING_SLASH`, see
// `next/dist/build/define-env.js` and `next/dist/client/normalize-trailing-slash.js`).
// Vitest runs component tests through Vite instead of Next's bundler, so that
// constant is never defined and `next/link` strips trailing slashes from
// hrefs, diverging from the static-exported site. Set it here so `<Link>` in
// tests matches production behavior.
process.env.__NEXT_TRAILING_SLASH = "true";
