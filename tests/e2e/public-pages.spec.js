const { test, expect } = require("@playwright/test");

test("la raíz redirige al inicio de sesión", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByText("Inicia sesión")).toBeVisible();
});

test("el login valida correo y contraseña antes de enviar", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("El email es requerido")).toBeVisible();
  await expect(page.getByText("La contraseña es requerida")).toBeVisible();

  await page.locator('input[name="email"]').fill("qa@example.com");
  await page.locator('input[name="password"]').fill("short");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(
    page.getByText("La contraseña debe tener al menos 8 caracteres")
  ).toBeVisible();
});

test("la pantalla de recuperación de contraseña es pública", async ({ page }) => {
  await page.goto("/auth/forgotPassword");

  await expect(page).toHaveURL(/\/auth\/forgotPassword$/);
  await expect(page.getByText(/contraseña/i).first()).toBeVisible();
});
