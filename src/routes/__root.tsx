import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Lexi" },
      { name: "description", content: "Practice lessons, studies, videos, movies and chess in one learning space." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#161616" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "apple-mobile-web-app-title", content: "Lexi" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Figtree:wght@400;600;700&display=swap" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", type: "image/png", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k="lexi-boot-reload",busy=false,re=/Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i;function show(){if(document.getElementById("lexi-recover"))return;var d=document.createElement("div");d.id="lexi-recover";d.setAttribute("style","position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#2a2a2a;color:#eee;font:16px system-ui;text-align:center;padding:24px");d.innerHTML='<div>Lexi is updating. Please reload.</div><button style="padding:12px 24px;border-radius:10px;border:0;background:#EFC500;color:#111;font:600 16px system-ui">Reload</button>';d.querySelector("button").onclick=function(){try{sessionStorage.removeItem(k)}catch(e){}location.reload()};(document.body||document.documentElement).appendChild(d)}function r(m){try{if(busy||!re.test(m||""))return;var n=+(sessionStorage.getItem(k)||0);if(n>=3){if(document.body)show();else addEventListener("DOMContentLoaded",show);return}busy=true;sessionStorage.setItem(k,String(n+1));setTimeout(function(){location.reload()},400+n*1200)}catch(e){}}addEventListener("error",function(e){r(e.message||(e.target&&e.target.tagName==="SCRIPT"?"Importing a module script failed":""))},true);addEventListener("unhandledrejection",function(e){r(String(e.reason&&e.reason.message||e.reason))});addEventListener("vite:preloadError",function(e){e.preventDefault();r("Importing a module script failed")});addEventListener("load",function(){setTimeout(function(){try{if(!document.getElementById("lexi-recover"))sessionStorage.removeItem(k)}catch(e){}},10000)});})();`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Recover once from stale module chunks (e.g. after an update) instead of a blank screen.
  useEffect(() => {
    const key = "lexi-boot-reload";
    const isChunkError = (msg: string) =>
      /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(msg);
    const recover = (msg: string) => {
      if (!isChunkError(msg)) return;
      const n = Number(sessionStorage.getItem(key) || 0);
      if (n >= 3) return;
      sessionStorage.setItem(key, String(n + 1));
      window.location.reload();
    };
    const onPreload = (e: Event) => {
      e.preventDefault();
      recover("Importing a module script failed");
    };
    const onRejection = (e: PromiseRejectionEvent) => recover(String(e.reason?.message ?? e.reason));
    const onError = (e: ErrorEvent) => recover(String(e.message));
    window.addEventListener("vite:preloadError", onPreload);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError);
    const clear = window.setTimeout(() => sessionStorage.removeItem(key), 10000);
    return () => {
      window.removeEventListener("vite:preloadError", onPreload);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError);
      window.clearTimeout(clear);
    };
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
