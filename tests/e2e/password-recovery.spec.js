const { test, expect } = require("@playwright/test");

test("recuperación mantiene el botón deshabilitado mientras falta el correo", async ({ page }) => {
  await page.goto("/auth/forgotPassword");

  await expect(page.getByRole("button", { name: "Cambiar contraseña" })).toBeDisabled();
  await expect(page.getByText("El campo de correo electrónico es obligatorio.")).toBeVisible();
});

test("recuperación solicita el correo y muestra confirmación al responder la API", async ({ page }) => {
  let requestedEmail;
  await page.route("**/api/auth/reset-password", async (route) => {
    requestedEmail = JSON.parse(route.request().postData());
    await route.fulfill({ contentType: "application/json", body: '{"error":false}' });
  });
  await page.goto("/auth/forgotPassword");

  await page.locator('input[name="email"]').fill("qa@example.com");
  await page.getByRole("button", { name: "Cambiar contraseña" }).click();

  await expect(page.getByText(/Hemos enviado a la dirección/)).toBeVisible();
  expect(requestedEmail).toEqual({ email: "qa@example.com" });
});

test("recuperación informa un error de API sin enviar al usuario a otra ruta", async ({ page }) => {
  await page.route("**/api/auth/reset-password", (route) =>
    route.fulfill({ status: 400, contentType: "application/json", body: '{"message":"Correo no encontrado"}' })
  );
  await page.goto("/auth/forgotPassword");

  await page.locator('input[name="email"]').fill("qa@example.com");
  await page.getByRole("button", { name: "Cambiar contraseña" }).click();

  await expect(page.getByText(/Error al enviar el correo/)).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/forgotPassword$/);
});

test("restablecimiento rechaza contraseñas diferentes antes de llamar la API", async ({ page }) => {
  let resetWasCalled = false;
  await page.route("**/api/auth/token/verify/**", (route) =>
    route.fulfill({ contentType: "application/json", body: '{"error":false}' })
  );
  await page.route("**/api/auth/reset-password-complete", (route) => {
    resetWasCalled = true;
    return route.fulfill({ contentType: "application/json", body: '{"error":false}' });
  });
  await page.goto("/auth/resetPassword?uidb64=qa-user&token=qa-token");

  await expect(page.locator('input[name="newPassword"]')).toBeVisible();
  await page.locator('input[name="newPassword"]').fill("Password_123");
  await page.locator('input[name="confirmPassword"]').fill("Different_123");
  await page.getByRole("button", { name: "Actualizar" }).click();

  await expect(page.getByText("Las contraseñas no coinciden.")).toBeVisible();
  expect(resetWasCalled).toBe(false);
});

test("restablecimiento válido envía el token y las dos contraseñas a la API", async ({ page }) => {
  let resetPayload;
  await page.route("**/api/auth/token/verify/**", (route) =>
    route.fulfill({ contentType: "application/json", body: '{"error":false}' })
  );
  await page.route("**/api/auth/reset-password-complete", async (route) => {
    resetPayload = JSON.parse(route.request().postData());
    await route.fulfill({ contentType: "application/json", body: '{"error":false}' });
  });
  await page.goto("/auth/resetPassword?uidb64=qa-user&token=qa-token");

  await expect(page.locator('input[name="newPassword"]')).toBeVisible();
  await page.locator('input[name="newPassword"]').fill("Password_123");
  await page.locator('input[name="confirmPassword"]').fill("Password_123");
  await page.getByRole("button", { name: "Actualizar" }).click();

  await expect.poll(() => resetPayload).toEqual({
    new_password: "Password_123",
    new_password2: "Password_123",
    uidb64: "qa-user",
    token: "qa-token",
  });
  await expect(page).toHaveURL(/\/auth\/login$/);
});
