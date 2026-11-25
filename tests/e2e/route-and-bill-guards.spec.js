const { test, expect } = require("@playwright/test");

const token = (permissions = []) => {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, permissions, account_scope: "INTERNAL" })
  ).toString("base64url");
  return `eyJhbGciOiJub25lIn0.${payload}.test-signature`;
};

async function setSession(page, permissions) {
  await page.addInitScript((accessToken) => localStorage.setItem("access-token", accessToken), token(permissions));
  await page.route("**/api/access-control/me/", (route) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify({ data: { permissions } }) })
  );
}

test("una ruta privada redirige a login cuando no hay sesión", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("un usuario autenticado sin permiso no puede entrar a facturas", async ({ page }) => {
  await setSession(page, []);
  await page.goto("/bills");

  await expect(page).toHaveURL(/\/dashboard$/);
});

test("el cargador de extracción de facturas solo acepta XML", async ({ page }) => {
  await setSession(page, ["bills.create"]);
  await page.goto("/bills");

  await expect(page.locator("#extractBill")).toHaveAttribute(
    "accept",
    ".xml,text/xml,application/xml"
  );
});
