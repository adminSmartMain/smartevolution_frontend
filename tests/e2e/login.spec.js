const { test, expect } = require("@playwright/test");
const corsHeaders = {
  "access-control-allow-origin": "http://127.0.0.1:3000",
  "access-control-allow-credentials": "true",
};

test("muestra el formulario de inicio de sesión", async ({ page }) => {
  await page.goto("/auth/login");

  await expect(page).toHaveTitle("Smart Evolution - Inicio de sesión");
  await expect(page.getByRole("heading", { name: "Bienvenido" })).toBeVisible();
  await expect(page.getByLabel("Correo electrónico")).toBeVisible();
  await expect(page.getByLabel("Contraseña", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  await expect(page.getByRole("link", { name: "¿Olvidaste tu contraseña?" })).toHaveAttribute(
    "href",
    "/auth/forgotPassword"
  );
});

test("bloquea doble envío mientras el login está en curso", async ({ page }) => {
  let requests = 0;
  let releaseRequest;
  await page.route("**/api/auth/login", (route) => {
    if (route.request().method() === "OPTIONS") {
      return route.fulfill({ status: 204, headers: corsHeaders });
    }
    requests += 1;
    return new Promise((resolve) => {
      releaseRequest = () => resolve(route.fulfill({
        status: 401,
        contentType: "application/json",
        headers: corsHeaders,
        body: JSON.stringify({ detail: "Usuario y/o Contraseña Incorrectos" }),
      }));
    });
  });

  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill("security@example.com");
  await page.locator('input[name="password"]').fill("SecurePass_123!");
  const submit = page.locator('button[type="submit"]');

  await submit.dblclick();
  await expect(submit).toBeDisabled();
  await expect.poll(() => requests).toBe(1);
  releaseRequest();
  await expect(submit).toBeEnabled();
});
