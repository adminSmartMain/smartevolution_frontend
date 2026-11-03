const { test, expect } = require("@playwright/test");

const token = (permissions) => {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, permissions, account_scope: "INTERNAL" })
  ).toString("base64url");
  return `eyJhbGciOiJub25lIn0.${payload}.test-signature`;
};

async function prepareAuthorizedPage(page, permissions) {
  await page.addInitScript((accessToken) => localStorage.setItem("access-token", accessToken), token(permissions));
  // The UI must render its form independently from production data. Individual
  // submission tests will replace these generic responses with exact fixtures.
  await page.route("**/api/**", (route) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify({ error: false, data: [], results: [] }) })
  );
  await page.route("**/api/access-control/me/", (route) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify({ data: { permissions } }) })
  );
}

test("cliente: la ruta autorizada carga el formulario de registro", async ({ page }) => {
  await prepareAuthorizedPage(page, ["clients.create"]);
  await page.goto("/customers?register");

  await expect(page.getByText("Registrar Nuevo Cliente")).toBeVisible();
  await expect(page.locator('input[name="document_number"]')).toBeVisible();
});

test("factura: la ruta autorizada carga el formulario y separa adjuntos de la extracción XML", async ({ page }) => {
  await prepareAuthorizedPage(page, ["bills.create"]);
  await page.goto("/bills/createBill");

  await expect(page.getByText("Creación de Facturas")).toBeVisible();
  await expect(page.getByRole("button", { name: "Seleccionar archivo" })).toBeVisible();
  await expect(page.locator('input[type="file"]').last()).toHaveAttribute("accept", ".pdf,.jpg,.jpeg,.png");
});

test("preoperación: la ruta autorizada carga el formulario de operación", async ({ page }) => {
  await prepareAuthorizedPage(page, ["preoperations.create"]);
  await page.goto("/pre-operations/manage");

  await expect(page.locator("h4.legacy-page-title")).toHaveText("Registrar Operación");
  await expect(page.getByTestId("numero-operacion")).toBeVisible();
});
