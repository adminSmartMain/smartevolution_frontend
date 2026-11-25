const { test, expect } = require("@playwright/test");

test("muestra el formulario de inicio de sesión", async ({ page }) => {
  await page.goto("/auth/login");

  await expect(page).toHaveTitle("Smart Evolution - Inicio de sesión");
  await expect(page.getByText("Inicia sesión")).toBeVisible();
  await expect(page.getByLabel("Correo electrónico")).toBeVisible();
  await expect(page.getByLabel("Contraseña")).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  await expect(page.getByRole("link", { name: "¿Olvidaste tu contraseña?" })).toHaveAttribute(
    "href",
    "/auth/forgotPassword"
  );
});
