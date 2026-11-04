const { test, expect } = require("@playwright/test");

const token = (permissions) => {
  const payload = Buffer.from(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + 3600,
    permissions,
    account_scope: "INTERNAL",
  })).toString("base64url");
  return `eyJhbGciOiJub25lIn0.${payload}.test-signature`;
};

const clients = [
  { id: "emitter-1", social_reason: "EMISOR DE PRUEBA S.A.S.", document_number: "800100100" },
  { id: "payer-1", social_reason: "PAGADOR DE PRUEBA S.A.S.", document_number: "900200200" },
  { id: "investor-1", social_reason: "INVERSIONISTA UNO S.A.S.", document_number: "901300300" },
];

const bills = [
  {
    id: "bill-1001",
    billId: "1001",
    payerId: "900200200",
    currentBalance: 1000000,
    dateBill: "2026-11-01",
    expirationDate: "2026-12-01",
    reBuyAvailable: false,
    integrationCode: "",
  },
  {
    id: "bill-1002",
    billId: "1002",
    payerId: "900200200",
    currentBalance: 2000000,
    dateBill: "2026-11-02",
    expirationDate: "2026-12-02",
    reBuyAvailable: false,
    integrationCode: "",
  },
];

const json = (route, data) => route.fulfill({
  contentType: "application/json",
  body: JSON.stringify(data),
});

async function prepareManagePage(page) {
  await page.addInitScript((accessToken) => localStorage.setItem("access-token", accessToken), token(["preoperations.create"]));
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/access-control/me/") return json(route, { data: { permissions: ["preoperations.create"] } });
    if (path === "/api/client/all") return json(route, { data: clients });
    if (path === "/api/preOperation/last") return json(route, { data: 2264 });
    if (path === "/api/type_operation") return json(route, { data: [{ id: "type-1", description: "Compra Títulos" }] });
    if (path === "/api/type_bill/") return json(route, { data: [] });
    if (path === "/api/bill/emitter-1") return json(route, { data: bills });
    if (path.startsWith("/api/preOperation/billFraction/")) return json(route, { data: { fraction: 1 } });
    if (path.startsWith("/api/broker/client/")) return json(route, {
      data: { id: "broker-1", first_name: "Corredor", last_name: "Prueba" },
    });
    if (path.startsWith("/api/riskProfile/client/")) return json(route, {
      data: { discount_rate: 26, discount_rate_investor: 20, gmf: false },
    });
    if (path.startsWith("/api/account/client/")) return json(route, {
      data: [
        { id: "account-1", account_number: "20220001", balance: 5000000 },
        { id: "account-2", account_number: "20220002", balance: 3000000 },
      ],
    });
    return json(route, { data: [], results: [] });
  });

  await page.goto("/pre-operations/manage");
  await expect(page.locator("h4.legacy-page-title")).toHaveText("Registrar Operación");

  await page.getByTestId("campo-emisor").locator("input").click();
  await page.getByRole("option", { name: /EMISOR DE PRUEBA/ }).click();
  await page.getByTestId("campo-pagador").locator("input").click();
  await page.getByRole("option", { name: /PAGADOR DE PRUEBA/ }).click();
}

async function selectBill(page, invoiceIndex, billNumber) {
  const selector = page.locator('[data-testid="campo-factura"]:visible').last().locator("input");
  await selector.click();
  await page.getByRole("option", { name: new RegExp(`^${billNumber}`) }).click();
}

async function selectInvestor(page, invoiceIndex) {
  const selector = page.locator('[data-testid="campo-inversor"]:visible').last().locator("input");
  await selector.click();
  await page.getByRole("option", { name: /INVERSIONISTA UNO/ }).click();
}

async function addInvoice(page) {
  await page.getByRole("button", { name: "Agregar Factura" }).click();
  await page.getByText(/^Factura 2\b/).click();
}

test.describe("pre-operaciones: administrar", () => {
  test("mantiene los nombres históricos y no genera desborde horizontal en tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 });
    await prepareManagePage(page);
    await selectBill(page, 0, "1001");

    await expect(page.getByLabel("% Descuento")).toBeVisible();
    await expect.poll(() => page.evaluate(() => (
      document.documentElement.scrollWidth <= window.innerWidth
    ))).toBeTruthy();
  });

  test("al limpiar una factura el catálogo sigue disponible para escoger otra", async ({ page }) => {
    await prepareManagePage(page);
    await selectBill(page, 0, "1001");

    const billSelector = page.getByTestId("campo-factura").first();
    const selector = billSelector.locator("input");
    await billSelector.getByLabel("Clear").click();

    await selector.click();
    await expect(page.getByRole("option", { name: /^1001/ })).toBeVisible();
    await expect(page.getByRole("option", { name: /^1002/ })).toBeVisible();
  });

  test("un inversionista con dos cuentas muestra ambas y la cuenta queda bloqueada al limpiarlo", async ({ page }) => {
    await prepareManagePage(page);
    await selectBill(page, 0, "1001");
    await selectInvestor(page, 0);

    const accountInput = page.locator('[data-testid="campo-investorAccount"]:visible').last().locator("input");
    await accountInput.click();
    await expect(page.getByRole("option", { name: "20220001" })).toBeVisible();
    await expect(page.getByRole("option", { name: "20220002" })).toBeVisible();

    const investorInput = page.locator('[data-testid="campo-inversor"]:visible').last().locator("input");
    await investorInput.click();
    await page.keyboard.press("Backspace");
    await expect(accountInput).toBeDisabled();
    await expect(accountInput).toHaveValue("");
  });

  test("rechaza repetir inversionista únicamente entre fracciones de la misma factura", async ({ page }) => {
    await prepareManagePage(page);
    await selectBill(page, 0, "1001");
    await selectInvestor(page, 0);

    await addInvoice(page);
    await selectBill(page, 1, "1001");
    await selectInvestor(page, 1);

    await expect(page.getByText("No puede asignar el mismo inversionista a facturas con el mismo número").first()).toBeVisible();
    await expect(page.locator('[data-testid="campo-inversor"]:visible').last().locator("input")).toHaveValue("");
  });

  test("permite repetir el inversionista si la factura es distinta", async ({ page }) => {
    await prepareManagePage(page);
    await selectBill(page, 0, "1001");
    await selectInvestor(page, 0);

    await addInvoice(page);
    await selectBill(page, 1, "1002");
    await selectInvestor(page, 1);

    await expect(page.locator('[data-testid="campo-inversor"]:visible').last().locator("input")).toHaveValue(/INVERSIONISTA UNO/);
    await expect(page.getByText("No puede asignar el mismo inversionista a facturas con el mismo número")).toHaveCount(0);
  });

  test("porcentaje pagado y valor nominal no permiten exceder el valor futuro", async ({ page }) => {
    await prepareManagePage(page);
    await selectBill(page, 0, "1001");

    const percentage = page.getByTestId("campo-payedPercent").first().locator("input");
    await percentage.fill("150");
    await expect(percentage).toHaveValue("100");

    const nominal = page.getByTestId("campo-payedAmount").first().locator("input");
    await nominal.fill("2000000");
    await nominal.press("Tab");
    await expect(nominal).toHaveValue(/1\.000\.000/);
  });
});
