(() => {
  "use strict";

  const API_URL = "https://omnia-api.macisterrodriguez16.workers.dev";
  const $ = (id) => document.getElementById(id);

  const money = (amount, currency) =>
    new Intl.NumberFormat("es-PA", {
      style: "currency",
      currency: currency || "USD"
    }).format(amount);

  let checkoutItem = null;
  let subtotal = 0;
  let quoteTimer = null;
  let quoteRequest = 0;

  function showEmptyCheckout() {
    $("summary-name").textContent = "No hay productos seleccionados";
    $("summary-variant").textContent = "Regresa a la tienda para elegir un producto.";
    $("summary-quantity").textContent = "0";
    $("summary-count").textContent = "0";
    $("summary-price").textContent = "—";
    $("summary-subtotal").textContent = "—";
    $("total-final-ui").textContent = "—";
    $("costo-envio-ui").textContent = "Por calcular";
    $("summary-image").removeAttribute("src");

    const button = $("btn-pagar");
    if (button) button.disabled = true;
  }

  function loadCheckout() {
    try {
      checkoutItem = JSON.parse(
        sessionStorage.getItem("omniaDirectCheckout") || "null"
      );
    } catch {
      checkoutItem = null;
    }

    const item = checkoutItem;

    if (
      !item ||
      !item.name ||
      !item.productId ||
      !item.variantId ||
      !Number.isFinite(Number(item.unitPrice)) ||
      Number(item.unitPrice) < 0 ||
      !Number.isInteger(Number(item.quantity)) ||
      Number(item.quantity) < 1
    ) {
      showEmptyCheckout();
      return;
    }

    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    subtotal = unitPrice * quantity;
    const currency = item.currency || "USD";

    $("summary-name").textContent = item.name;
    $("summary-variant").textContent = item.variant || "Variante seleccionada";
    $("summary-quantity").textContent = String(quantity);
    $("summary-count").textContent = String(quantity);
    $("summary-price").textContent = money(unitPrice, currency);
    $("summary-subtotal").textContent = money(subtotal, currency);
    $("costo-envio-ui").textContent = "Completa tu dirección";
    $("total-final-ui").textContent = money(subtotal, currency);

    if (item.image) {
      $("summary-image").src = item.image;
      $("summary-image").alt = item.name;
    } else {
      $("summary-image").removeAttribute("src");
    }

    const button = $("btn-pagar");
    if (button) button.disabled = true;

    scheduleShippingQuote();
  }

  function populateCountries() {
    const select = $("country");
    if (!select) return;

    const codes = (
      "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ " +
      "BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ " +
      "CA CC CD CF CG CH CI CL CM CN CO CR CV CW CX CY CZ " +
      "DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FO FR " +
      "GA GB GD GE GF GH GI GL GM GN GP GQ GR GT GU GW GY " +
      "HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
      "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY " +
      "MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ " +
      "NA NC NE NF NG NI NL NO NP NR NU NZ OM " +
      "PA PE PF PG PH PK PL PM PN PR PS PT PW PY " +
      "QA RE RO RS RU RW " +
      "SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ " +
      "TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ " +
      "UA UG UM US UY UZ " +
      "VA VC VE VG VI VN VU WF WS " +
      "YE YT ZA ZM ZW"
    ).trim().split(/\s+/);

    const names = new Intl.DisplayNames(["es"], { type: "region" });
    const current = select.value;

    select.replaceChildren(new Option("Seleccionar país", ""));

    codes
      .map(code => ({ code, name: names.of(code) || code }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .forEach(({ code, name }) => {
        select.add(new Option(name, code));
      });

    if (codes.includes(current)) select.value = current;
  }

  function getAddress() {
    return {
      first_name: $("firstName").value.trim(),
      last_name: $("lastName").value.trim(),
      email: $("email").value.trim(),
      phone: $("phone").value.trim(),
      country: $("country").value.trim().toUpperCase(),
      region: $("state").value.trim(),
      address1: $("address").value.trim(),
      address2: $("address2").value.trim(),
      city: $("city").value.trim(),
      zip: $("postalCode").value.trim()
    };
  }

  function addressIsComplete(address) {
    return Boolean(
      address.first_name &&
      address.last_name &&
      address.country &&
      /^[A-Z]{2}$/.test(address.country) &&
      address.address1 &&
      address.city &&
      address.zip
    );
  }

  function scheduleShippingQuote() {
    clearTimeout(quoteTimer);
    quoteRequest++;

    $("costo-envio-ui").textContent = "Por calcular";
    $("total-final-ui").textContent = money(subtotal, "USD");

    const address = getAddress();

    if (!checkoutItem || !addressIsComplete(address)) {
      $("costo-envio-ui").textContent = "Completa tu dirección";
      return;
    }

    $("costo-envio-ui").textContent = "Calculando envío…";

    quoteTimer = setTimeout(() => {
      requestShippingQuote(address, quoteRequest);
    }, 700);
  }

  async function requestShippingQuote(address, requestId) {
    try {
      const response = await fetch(`${API_URL}/api/shipping/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [{
            printify_product_id: checkoutItem.productId,
            variant_id: checkoutItem.variantId,
            quantity: Number(checkoutItem.quantity)
          }],
          address_to: address
        })
      });

      const data = await response.json();
      console.log("OMNIA SHIPPING HTTP:", response.status);
      console.log("OMNIA SHIPPING RESPONSE:", data);

      if (requestId !== quoteRequest) return;

      if (!response.ok || data.status !== "success" || !data.shipping) {
        const detail = data.details ? ` Detalle: ${data.details}` : "";
        const status = data.printify_status ? ` (HTTP ${data.printify_status})` : "";
        throw new Error(`${data.message || "No se pudo calcular el envío."}${status}${detail}`);
      }

      const rates = Object.entries(data.shipping)
            .filter(([name, value]) =>
                typeof name === "string" &&
                name.trim() !== "" &&
                value !== null &&
                value !== "" &&
                Number.isFinite(Number(value)) &&
                Number(value) >= 0
            );

        if (!rates.length) {
            throw new Error(
                "Printify no devolvió tarifas numéricas: " +
                JSON.stringify(data.shipping)
            );
        }

        const standard = rates.find(([name]) =>
            name.toLowerCase() === "standard"
        );

        const selectedRate = standard ||
            rates.reduce((cheapest, current) =>
                Number(current[1]) < Number(cheapest[1]) ? current : cheapest
            );

        const shippingCost = Number(selectedRate[1]);

      $("costo-envio-ui").textContent = money(shippingCost, "USD");
      $("total-final-ui").textContent = money(subtotal + shippingCost, "USD");

    } catch (error) {
      if (requestId !== quoteRequest) return;

      console.error("Error cotizando envío OMNIA:", error);
      $("costo-envio-ui").textContent = error.message || "No disponible";
      $("total-final-ui").textContent = money(subtotal, "USD");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    populateCountries();
    loadCheckout();

    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "country",
      "state",
      "address",
      "address2",
      "city",
      "postalCode"
    ].forEach(id => {
      const field = $(id);
      if (!field) return;

      field.addEventListener("input", scheduleShippingQuote);
      field.addEventListener("change", scheduleShippingQuote);
    });
  });
})();
