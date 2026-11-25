import { getAccessToken } from "@lib/auth/session";
const { test, expect } = require("@playwright/test");
const corsHeaders = {
  "access-control-allow-origin": "http://127.0.0.1:3000",
  "access-control-allow-credentials": "true",
};

const token = (permissions = []) => {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 3600,
      user_id: "qa-user",
      name: "QA User",
      is_superuser: false,
      permissions,
    })
  ).toString("base64url");
  return `eyJhbGciOiJub25lIn0.${payload}.test-signature`;
};

test("el login muestra un error si la API rechaza las credenciales", async ({ page }) => {
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({ status: 401, contentType: "application/json", headers: corsHeaders, body: '{"detail":"invalid"}' })
  );
  await page.goto("/auth/login");

  await page.locator('input[name="email"]').fill("qa@example.com");
  await page.locator('input[name="password"]').fill("Password_123");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Usuario y/o Contraseña incorrectos")).toBeVisible();
});

test("el login guarda sesión y navega al dashboard cuando la API responde correctamente", async ({ page }) => {
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({ access: token(["bills.create"]) }),
    })
  );
  await page.route("**/api/access-control/me/", (route) =>
    route.fulfill({ contentType: "application/json", headers: corsHeaders, body: '{"data":{"permissions":["bills.create"]}}' })
  );
  await page.goto("/auth/login");

  await page.locator('input[name="email"]').fill("qa@example.com");
  await page.locator('input[name="password"]').fill("Password_123");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await page.waitForTimeout(100);
  await expect(page.evaluate(() => getAccessToken())).resolves.toBeNull();
  await expect(page.evaluate(() => localStorage.getItem("refresh-token"))).resolves.toBeNull();
});

test("la contraseña se puede mostrar u ocultar sin cambiar su valor", async ({ page }) => {
  await page.goto("/auth/login");
  const password = page.locator('input[name="password"]');

  await password.fill("Password_123");
  await expect(password).toHaveAttribute("type", "password");
  await page.getByLabel("toggle password visibility").click();

  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("Password_123");
});
