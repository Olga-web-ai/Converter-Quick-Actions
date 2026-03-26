const appShell = document.querySelector(".app-shell");
const phoneFrame = document.querySelector(".phone-frame");
const fiatInput = document.querySelector("#fiat-amount");
const cryptoInput = document.querySelector("#crypto-amount");
const fiatSelector = document.querySelector('[data-role="fiat-selector"]');
const cryptoSelector = document.querySelector('[data-role="crypto-selector"]');
const fiatSelectorCoin = document.querySelector('[data-role="fiat-selector-coin"]');
const fiatSelectorLabel = document.querySelector('[data-role="fiat-selector-label"]');
const payField = document.querySelector('[data-field="pay"]');
const getField = document.querySelector('[data-field="get"]');
const payLabel = payField.querySelector('[data-role="label"]');
const getLabel = getField.querySelector('[data-role="label"]');
const fiatEquivalent = getField.querySelector('[data-role="fiat-equivalent"]');
const rewardValue = getField.querySelector('[data-role="reward-value"]');
const rewardPill = getField.querySelector('[data-role="reward-pill"]');
const fiatDecimalPlaceholder = document.querySelector('[data-role="fiat-decimal-placeholder"]');
const fiatMeasure = document.querySelector('[data-role="fiat-measure"]');
const summaryTitle = document.querySelector('[data-role="summary-title"]');
const summaryReward = document.querySelector('[data-role="summary-reward"]');
const summaryLargeCopy = document.querySelector('[data-role="summary-large-copy"]');
const summaryCta = document.querySelector('[data-role="summary-cta"]');
const boostToggle = document.querySelector('[data-role="boost-toggle"]');
const summaryCard = document.querySelector(".summary-card");
const inputKeyboard = document.querySelector('[data-role="input-keyboard"]');
const keyboardConfirm = document.querySelector('[data-role="keyboard-confirm"]');
const keyboardKeys = [...document.querySelectorAll(".input-keyboard__key")];
const quickActions = [...document.querySelectorAll(".quick-action")];
const currencyModal = document.querySelector('[data-role="currency-modal"]');
const currencyModalClosers = [...document.querySelectorAll('[data-role="currency-modal-close"]')];
const currencyOptionButtons = [...document.querySelectorAll('[data-role="currency-option"]')];
const assetModal = document.querySelector('[data-role="asset-modal"]');
const assetModalImage = document.querySelector('[data-role="asset-modal-image"]');
const assetModalClosers = [...document.querySelectorAll('[data-role="asset-modal-close"]')];
const assetFilterButtons = [...document.querySelectorAll('[data-role="asset-filter"]')];
const assetNetworkClear = document.querySelector('[data-role="asset-network-clear"]');
const assetNetworkTrigger = document.querySelector('[data-role="asset-network-trigger"]');
const assetNetworkTriggerLabel = document.querySelector('[data-role="asset-network-trigger-label"]');
const assetNetworkTriggerIcon = document.querySelector('[data-role="asset-network-trigger-icon"]');
const assetNetworkMask = document.querySelector('[data-role="asset-network-mask"]');
const assetNetworkRow = document.querySelector('[data-role="asset-network-row"]');
const assetNetworkButtons = [...document.querySelectorAll('[data-role="asset-network"]')];
const ASSET_MODAL_VERSION = "20260320-2038";
const isLikelyMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent,
);
const isNativeMobileMode =
  isLikelyMobileUserAgent ||
  (navigator.maxTouchPoints > 1 && window.innerWidth <= 1024) ||
  window.matchMedia("(pointer: coarse)").matches ||
  window.matchMedia("(hover: none)").matches ||
  window.innerWidth <= 820;

if (isNativeMobileMode) {
  document.documentElement.classList.add("native-mobile-mode");
  document.body.classList.add("native-mobile-mode");
  document.documentElement.style.setProperty("--mobile-app-height", `${window.innerHeight}px`);
}

function lockMobileViewport() {
  if (!isNativeMobileMode) {
    return;
  }
  document.documentElement.style.setProperty("--mobile-app-height", `${window.innerHeight}px`);
  window.scrollTo(0, 0);
}

if (isNativeMobileMode) {
  window.addEventListener("resize", lockMobileViewport);
  window.addEventListener("orientationchange", lockMobileViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      window.scrollTo(0, 0);
    });
  }
}

function installPreventScrollFocus(input) {
  if (!isNativeMobileMode) {
    return;
  }
  input.addEventListener("touchstart", (event) => {
    if (document.activeElement === input) {
      return;
    }
    event.preventDefault();
    input.focus({ preventScroll: true });
  }, { passive: false });
}

installPreventScrollFocus(fiatInput);
installPreventScrollFocus(cryptoInput);

const MIN_FIAT = 15;
const MIN_CRYPTO = 0.0078;
const REWARD_RATE = 0.0115;
const LARGE_ORDER_THRESHOLD = 50000;
const PRO_THRESHOLD_LABEL = "€50,000";
const DEFAULT_ASSET = {
  symbol: "ETH",
  price: 1875.62,
};
const FIAT_OPTIONS = [
  { code: "EUR", name: "Euro", symbol: "€", locale: "en-IE", style: "eu", eurRate: 1 },
  { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US", style: "usd", eurRate: 1.08 },
  { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB", style: "gbp", eurRate: 0.84 },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", locale: "pl-PL", style: "pln", eurRate: 4.29 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", locale: "id-ID", style: "idr", selectorLabel: "Rp", eurRate: 17650 },
];

let activeField = "pay";
let boostPointsEnabled = true;
let fiatRaw = "100";
let cryptoRaw = "0.0533";
let selectedFiat = FIAT_OPTIONS[0];
let assetCategory = "all";
let assetNetworkMenuOpen = false;
let selectedAssetNetwork = "";
let assetNetworkDragging = false;
let assetNetworkMoved = false;
let assetNetworkStartX = 0;
let assetNetworkStartScrollLeft = 0;
const amountMeasureCanvas = document.createElement("canvas");
const amountMeasureContext = amountMeasureCanvas.getContext("2d");

phoneFrame.dataset.deviceMode = isNativeMobileMode ? "mobile" : "desktop";
appShell.dataset.deviceMode = isNativeMobileMode ? "mobile" : "desktop";

function normalizeFiatInput(value) {
  const normalized = value.replace(/[^\d.,]/g, "").replace(/,/g, "");
  if (normalized === "") {
    return "";
  }
  const hasDot = normalized.includes(".");
  const [wholePart = "", decimalPart = ""] = normalized.split(".");
  const wholeClean = wholePart.replace(/^0+(?=\d)/, "").slice(0, 13);
  const trimmedWhole = wholeClean || (hasDot ? "0" : "");
  const trimmedDecimal = decimalPart.slice(0, 2);

  return hasDot ? `${trimmedWhole}.${trimmedDecimal}` : trimmedWhole;
}

function normalizeCryptoInput(value) {
  const normalized = value.replace(/[^\d.,]/g, "").replace(",", ".");
  if (normalized === "") {
    return "";
  }
  const hasDot = normalized.includes(".");
  const [wholePart = "", decimalPart = ""] = normalized.split(".");
  const wholeClean = wholePart.replace(/^0+(?=\d)/, "");
  const trimmedWhole = wholeClean || (hasDot ? "0" : "");
  const trimmedDecimal = decimalPart.slice(0, 8);

  return hasDot ? `${trimmedWhole}.${trimmedDecimal}` : trimmedWhole;
}

function parseRawNumber(rawValue) {
  const normalized = rawValue.endsWith(".") ? rawValue.slice(0, -1) : rawValue;
  return Number(normalized || "0");
}

function formatFiat(value) {
  return new Intl.NumberFormat(selectedFiat.locale, {
    style: "currency",
    currency: selectedFiat.code,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatCrypto(value, maximumFractionDigits = 8) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits,
  });
}

function formatReward(value) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatFiatDisplay(rawValue) {
  if (rawValue === "") {
    return "";
  }
  const [wholePart = "0", decimalPart = ""] = rawValue.split(".");
  const formattedWhole = Number(wholePart || "0").toLocaleString("en-US");

  if (rawValue.includes(".")) {
    return `${formattedWhole}.${decimalPart}`;
  }

  return formattedWhole;
}

function toEurAmount(value, fiat = selectedFiat) {
  return value / (fiat.eurRate || 1);
}

function fromEurAmount(value, fiat = selectedFiat) {
  return value * (fiat.eurRate || 1);
}

function serializeFiatValue(value) {
  if (!Number.isFinite(value) || value === 0) {
    return "0";
  }

  const fixed = value
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");

  return normalizeFiatInput(fixed);
}

function measureAmountText(text, fontSize) {
  if (!amountMeasureContext) {
    return 0;
  }

  amountMeasureContext.font = `500 ${fontSize}px "ES Rebond Grotesque", -apple-system, BlinkMacSystemFont, sans-serif`;
  return amountMeasureContext.measureText(text || "0").width;
}

function fitAmountFontSize(text, availableWidth) {
  const safeText = text || "0";
  const maxSize = 44;
  const minSize = 16;

  for (let size = maxSize; size >= minSize; size -= 1) {
    if (measureAmountText(safeText, size) <= Math.max(0, availableWidth - 2)) {
      return size;
    }
  }

  return minSize;
}

function syncAmountTypography() {
  const fiatText = fiatInput.value || "0";
  const cryptoText = cryptoInput.value || "0";
  const fiatWidth = fiatInput.parentElement.getBoundingClientRect().width;
  const cryptoWidth = cryptoInput.parentElement.getBoundingClientRect().width;
  const fiatSize = fitAmountFontSize(fiatText, fiatWidth);
  const cryptoSize = fitAmountFontSize(cryptoText, cryptoWidth);

  fiatInput.style.fontSize = `${fiatSize}px`;
  fiatInput.style.lineHeight = "48px";
  cryptoInput.style.fontSize = `${cryptoSize}px`;
  cryptoInput.style.lineHeight = "48px";
  fiatDecimalPlaceholder.style.fontSize = `${fiatSize}px`;
  fiatDecimalPlaceholder.style.lineHeight = "48px";
  fiatMeasure.style.fontSize = `${fiatSize}px`;
  fiatMeasure.style.lineHeight = "48px";
}

function updateFiatDecimalPlaceholder() {
  syncAmountTypography();
  const hasDot = fiatRaw.includes(".");
  const decimalPart = hasDot ? fiatRaw.split(".")[1] ?? "" : "";
  const placeholder = hasDot ? "0".repeat(Math.max(0, 2 - decimalPart.length)) : "";

  fiatDecimalPlaceholder.textContent = placeholder;
  fiatDecimalPlaceholder.hidden = !placeholder;
  fiatMeasure.textContent = formatFiatDisplay(fiatRaw);
  const measureWidth = fiatMeasure.getBoundingClientRect().width;
  const editorWidth = fiatInput.getBoundingClientRect().width;
  const placeholderWidth = fiatDecimalPlaceholder.getBoundingClientRect().width || placeholder.length * 22;
  const currentFontSize = Number.parseFloat(window.getComputedStyle(fiatInput).fontSize) || 44;
  const adaptiveGap = Math.max(3, Math.min(7, currentFontSize * 0.1));
  const maxLeft = Math.max(0, editorWidth - placeholderWidth - 2);
  const offset = Math.max(0, Math.min(measureWidth + adaptiveGap, maxLeft));
  fiatDecimalPlaceholder.style.setProperty("--decimal-offset", `${offset}px`);
}

function setFieldFocus(field, focused) {
  field.dataset.interaction = focused ? "focus" : "rest";
  field.classList.toggle("is-focused", focused);
}

function setKeyboardVisible(visible) {
  if (isNativeMobileMode) {
    inputKeyboard.classList.remove("is-visible");
    phoneFrame.dataset.keyboard = "hidden";
    return;
  }
  inputKeyboard.classList.toggle("is-visible", visible);
  phoneFrame.dataset.keyboard = visible ? "visible" : "hidden";
}

function closeKeyboard() {
  setFieldFocus(payField, false);
  setFieldFocus(getField, false);
  summaryCard.classList.remove("is-hidden");
  setKeyboardVisible(false);
  fiatInput.blur();
  cryptoInput.blur();
}

function closeCurrencyModal() {
  phoneFrame.dataset.modal = "closed";
  currencyModal.setAttribute("aria-hidden", "true");
}

function openCurrencyModal() {
  closeKeyboard();
  closeAssetModal();
  phoneFrame.dataset.modal = "currency";
  currencyModal.setAttribute("aria-hidden", "false");
}

function closeAssetModal() {
  phoneFrame.dataset.modal = "closed";
  assetModal.setAttribute("aria-hidden", "true");
  assetNetworkMenuOpen = false;
  assetNetworkClear.hidden = true;
  assetNetworkRow.hidden = true;
}

function updateAssetModalImage() {
  const nextImage =
    !assetNetworkMenuOpen && selectedAssetNetwork
      ? `./assets/screens/select-asset-network-solana.png?v=${ASSET_MODAL_VERSION}`
      : `./assets/screens/select-asset-exact.png?v=${ASSET_MODAL_VERSION}`;

  if (assetModalImage.getAttribute("src") !== nextImage) {
    assetModalImage.setAttribute("src", nextImage);
  }
  assetModal.dataset.overlay = assetNetworkMenuOpen ? "network-open" : "default";
}

function openAssetModal() {
  closeKeyboard();
  closeCurrencyModal();
  assetCategory = "all";
  assetNetworkMenuOpen = false;
  selectedAssetNetwork = "";
  phoneFrame.dataset.modal = "asset";
  assetModal.setAttribute("aria-hidden", "false");
  updateAssetFilterUi();
}

function updateAssetFilterUi() {
  assetNetworkRow.hidden = !assetNetworkMenuOpen;
  const useStaticSelectedNetwork = !assetNetworkMenuOpen && Boolean(selectedAssetNetwork);

  assetNetworkClear.hidden = !useStaticSelectedNetwork;
  assetNetworkTrigger.hidden = true;
  assetNetworkTriggerLabel.textContent = "Network";
  assetNetworkTriggerIcon.hidden = true;
  assetNetworkTriggerIcon.setAttribute("src", "");

  updateAssetModalImage();
}

function setFieldHover(field, hovering) {
  if (field.dataset.interaction === "focus") {
    return;
  }

  field.dataset.interaction = hovering ? "hover" : "rest";
}

function syncQuickActions(amount) {
  quickActions.forEach((button) => {
    const isActive = !isNativeMobileMode && Number(button.dataset.amount) === amount;
    button.classList.toggle("is-active", isActive);
  });
}

function getQuickActionConfig() {
  if (selectedFiat.code === "IDR") {
    return [
      { value: 300000, label: "Rp300,000" },
      { value: 500000, label: "Rp500,000" },
    ];
  }

  return [
    { value: 50, label: `${selectedFiat.symbol}50` },
    { value: 100, label: `${selectedFiat.symbol}100` },
    { value: 150, label: `${selectedFiat.symbol}150` },
    { value: 200, label: `${selectedFiat.symbol}200` },
  ];
}

function syncAmountLengthClass(node, visibleValue) {
  const length = String(visibleValue).length;
  node.classList.toggle("is-medium", length >= 8 && length <= 10);
  node.classList.toggle("is-long", length >= 11 && length <= 13);
  node.classList.toggle("is-xlong", length >= 14 && length <= 16);
  node.classList.toggle("is-xxlong", length >= 17);
}

function resetValidation() {
  payField.dataset.validation = "normal";
  getField.dataset.validation = "normal";
  payLabel.textContent = "You pay";
  getLabel.textContent = "You get";
}

function updateFiatSelector() {
  fiatSelectorLabel.textContent = selectedFiat.selectorLabel || selectedFiat.code;
  const coinClass =
    selectedFiat.style === "eu"
      ? "asset-selector__coin asset-selector__coin--eu"
      : `asset-selector__coin asset-selector__coin--fiat asset-selector__coin--fiat-${selectedFiat.style}`;

  fiatSelectorCoin.className = coinClass;
  if (selectedFiat.style === "eu") {
    fiatSelectorCoin.innerHTML = `
      <span class="asset-selector__eu-stars" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i><i></i>
        <i></i><i></i><i></i><i></i><i></i><i></i>
      </span>
    `;
  } else if (selectedFiat.style === "idr") {
    fiatSelectorCoin.innerHTML = "";
  } else {
    fiatSelectorCoin.innerHTML = `<span class="asset-selector__fiat-glyph" aria-hidden="true">${selectedFiat.symbol}</span>`;
  }
}

function updateQuickActionLabels() {
  const config = getQuickActionConfig();
  const visibleCount = config.length;
  const quickActionsContainer = quickActions[0]?.parentElement;

  if (quickActionsContainer) {
    quickActionsContainer.dataset.count = String(visibleCount);
  }

  quickActions.forEach((button, index) => {
    const item = config[index];
    if (!item) {
      button.hidden = true;
      button.dataset.amount = "";
      button.textContent = "";
      return;
    }

    button.hidden = false;
    button.dataset.amount = String(item.value);
    button.textContent = item.label;
  });
}

function selectFiatCurrency(code) {
  const matchedFiat = FIAT_OPTIONS.find((option) => option.code === code);
  if (!matchedFiat) {
    return;
  }

  const previousFiat = selectedFiat;
  const currentFiatValue = parseRawNumber(fiatRaw || "0");
  const eurValue =
    activeField === "get"
      ? parseRawNumber(cryptoRaw || "0") * DEFAULT_ASSET.price
      : toEurAmount(currentFiatValue, previousFiat);

  selectedFiat = matchedFiat;
  updateFiatSelector();
  updateQuickActionLabels();
  renderFromFiat(serializeFiatValue(fromEurAmount(eurValue, selectedFiat)));
  closeCurrencyModal();
}

function updateSummary(fiatValue, cryptoAmount, rewardAmount, eurValue) {
  const isLargeOrder = eurValue >= LARGE_ORDER_THRESHOLD;
  const rewardsVisible = boostPointsEnabled && !isLargeOrder;

  fiatEquivalent.textContent = formatFiat(fiatValue || 0);
  rewardValue.textContent = `+${formatReward(rewardAmount || 0)}`;
  summaryTitle.textContent = isLargeOrder
    ? "High-value order"
    : `${formatCrypto(cryptoAmount)} ${DEFAULT_ASSET.symbol} for ${formatFiat(fiatValue || 0)}`;
  summaryReward.textContent = rewardsVisible
    ? `+${formatReward(rewardAmount || 0)} Boost Points included`
    : "";
  summaryCta.textContent = isLargeOrder
    ? "Continue with Mercuryo PRO"
    : `Pay ${formatFiat(fiatValue || 0)}`;

  rewardPill.dataset.state = rewardsVisible ? "on" : "off";
  summaryReward.dataset.state = rewardsVisible ? "on" : "off";
  getField.dataset.boost = rewardsVisible ? "on" : "off";
  summaryCard.dataset.boost = rewardsVisible ? "on" : "off";
  summaryCard.dataset.mode = isLargeOrder ? "large" : "default";
  payField.dataset.sizeMode = isLargeOrder ? "large" : "default";
  summaryLargeCopy.hidden = !isLargeOrder;
  boostToggle.hidden = isLargeOrder;
  boostToggle.setAttribute("aria-pressed", String(boostPointsEnabled));
  boostToggle.textContent = boostPointsEnabled
    ? "I don’t need Boost Points"
    : "Use Boost Points";
}

function renderFromFiat(rawValue) {
  activeField = "pay";
  fiatRaw = normalizeFiatInput(rawValue);

  const fiatValue = parseRawNumber(fiatRaw);
  const eurValue = toEurAmount(fiatValue);
  const cryptoAmount = eurValue / DEFAULT_ASSET.price;
  const rewardAmount = eurValue * REWARD_RATE;
  const hasError =
    fiatRaw === "0" ||
    fiatRaw === "0." ||
    fiatRaw === "" ||
    eurValue < MIN_FIAT;

  cryptoRaw = formatCrypto(cryptoAmount, 4);
  fiatInput.value = formatFiatDisplay(fiatRaw);
  cryptoInput.value = cryptoRaw;
  fiatInput.scrollLeft = 0;
  cryptoInput.scrollLeft = 0;
  syncAmountLengthClass(fiatDecimalPlaceholder, fiatInput.value);
  syncAmountLengthClass(fiatMeasure, fiatInput.value);
  updateFiatDecimalPlaceholder();
  updateSummary(fiatValue, cryptoAmount, rewardAmount, eurValue);

  resetValidation();
  if (eurValue >= LARGE_ORDER_THRESHOLD) {
    payLabel.textContent = `You pay · Use PRO above ${PRO_THRESHOLD_LABEL}`;
  } else if (hasError) {
    payField.dataset.validation = "error";
    payLabel.textContent = `You pay · Minimum ${formatFiat(fromEurAmount(MIN_FIAT))}`;
  }

  syncAmountLengthClass(fiatInput, fiatInput.value);
  syncAmountLengthClass(cryptoInput, cryptoInput.value);
  syncQuickActions(fiatValue);
  updateFiatSelector();
  updateQuickActionLabels();
}

function renderFromCrypto(rawValue) {
  activeField = "get";
  cryptoRaw = normalizeCryptoInput(rawValue);

  if (cryptoRaw === "") {
    const fiatValue = 0;
    const cryptoAmount = 0;
    const rewardAmount = 0;

    cryptoInput.value = "";
    fiatRaw = "0";
    fiatInput.value = formatFiatDisplay(fiatRaw);
    cryptoInput.scrollLeft = 0;
    fiatInput.scrollLeft = 0;
    syncAmountLengthClass(fiatDecimalPlaceholder, fiatInput.value);
    syncAmountLengthClass(fiatMeasure, fiatInput.value);
    updateFiatDecimalPlaceholder();
    updateSummary(fiatValue, cryptoAmount, rewardAmount, 0);

    resetValidation();
    getLabel.textContent = `You get · Minimum ${MIN_CRYPTO} ${DEFAULT_ASSET.symbol}`;
    getField.dataset.validation = "error";

    syncAmountLengthClass(fiatInput, fiatInput.value);
    syncAmountLengthClass(cryptoInput, cryptoInput.value);
    syncQuickActions(fiatValue);
    updateFiatSelector();
    updateQuickActionLabels();
    return;
  }

  const cryptoAmount = parseRawNumber(cryptoRaw);
  const eurValue = cryptoAmount * DEFAULT_ASSET.price;
  const fiatValue = fromEurAmount(eurValue);
  const rewardAmount = eurValue * REWARD_RATE;
  const hasError =
    cryptoRaw === "0" ||
    cryptoRaw === "0." ||
    cryptoRaw === "" ||
    cryptoAmount < MIN_CRYPTO;

  fiatRaw = serializeFiatValue(fiatValue);
  cryptoInput.value = cryptoRaw;
  fiatInput.value = formatFiatDisplay(fiatRaw);
  cryptoInput.scrollLeft = 0;
  fiatInput.scrollLeft = 0;
  syncAmountLengthClass(fiatDecimalPlaceholder, fiatInput.value);
  syncAmountLengthClass(fiatMeasure, fiatInput.value);
  updateFiatDecimalPlaceholder();
  updateSummary(fiatValue, cryptoAmount, rewardAmount, eurValue);

  resetValidation();
  if (eurValue >= LARGE_ORDER_THRESHOLD) {
    getLabel.textContent = `You get · Use PRO above ${PRO_THRESHOLD_LABEL}`;
  }
  if (hasError) {
    getField.dataset.validation = "error";
    getLabel.textContent = `You get · Minimum ${MIN_CRYPTO} ${DEFAULT_ASSET.symbol}`;
  }

  syncAmountLengthClass(fiatInput, fiatInput.value);
  syncAmountLengthClass(cryptoInput, cryptoInput.value);
  syncQuickActions(fiatValue);
  updateFiatSelector();
  updateQuickActionLabels();
}

fiatInput.addEventListener("focus", () => {
  activeField = "pay";
  setFieldFocus(payField, true);
  setFieldFocus(getField, false);
  if (!isNativeMobileMode) {
    summaryCard.classList.add("is-hidden");
  }
  setKeyboardVisible(true);
  if (isNativeMobileMode) {
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }
});

cryptoInput.addEventListener("focus", () => {
  activeField = "get";
  setFieldFocus(getField, true);
  setFieldFocus(payField, false);
  if (!isNativeMobileMode) {
    summaryCard.classList.add("is-hidden");
  }
  setKeyboardVisible(true);
  if (isNativeMobileMode) {
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }
});

fiatInput.addEventListener("blur", () => {
  if (activeField === "pay") {
    if (fiatRaw === "") {
      renderFromFiat("0");
    }
    setFieldFocus(payField, false);
    if (!isNativeMobileMode) {
      summaryCard.classList.remove("is-hidden");
    }
    setKeyboardVisible(false);
  }
});

cryptoInput.addEventListener("blur", () => {
  if (activeField === "get") {
    if (cryptoRaw === "") {
      renderFromCrypto("0");
    }
    setFieldFocus(getField, false);
    if (!isNativeMobileMode) {
      summaryCard.classList.remove("is-hidden");
    }
    setKeyboardVisible(false);
  }
});

fiatInput.addEventListener("input", (event) => {
  renderFromFiat(event.target.value);
});

cryptoInput.addEventListener("input", (event) => {
  renderFromCrypto(event.target.value);
});

quickActions.forEach((button) => {
  button.addEventListener("click", () => {
    renderFromFiat(button.dataset.amount);
  });
});

boostToggle.addEventListener("click", () => {
  boostPointsEnabled = !boostPointsEnabled;
  const currentFiat = parseRawNumber(fiatRaw);
  const currentCrypto = parseRawNumber(cryptoRaw);
  const rewardAmount = toEurAmount(currentFiat) * REWARD_RATE;
  updateSummary(currentFiat, currentCrypto, rewardAmount, toEurAmount(currentFiat));
});

fiatSelector.addEventListener("click", () => {
  openCurrencyModal();
});

cryptoSelector.addEventListener("click", () => {
  openAssetModal();
});

currencyModalClosers.forEach((button) => {
  button.addEventListener("click", () => {
    closeCurrencyModal();
  });
});

currencyOptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectFiatCurrency(button.dataset.currency);
  });
});

assetModalClosers.forEach((button) => {
  button.addEventListener("click", () => {
    closeAssetModal();
  });
});

assetFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.filter === "network") {
      assetNetworkMenuOpen = !assetNetworkMenuOpen;
      updateAssetFilterUi();
      return;
    }

    assetCategory = button.dataset.filter;
    selectedAssetNetwork = "";
    assetNetworkMenuOpen = false;
    updateAssetFilterUi();
  });
});

assetNetworkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedAssetNetwork = "solana";
    assetNetworkMenuOpen = false;
    updateAssetFilterUi();
  });
});

assetNetworkClear.addEventListener("click", () => {
  selectedAssetNetwork = "";
  assetNetworkMenuOpen = false;
  updateAssetFilterUi();
});

inputKeyboard.addEventListener("mousedown", (event) => {
  event.preventDefault();
});

function applyKeyboardInput(key) {
  let nextValue = activeField === "get" ? cryptoRaw : fiatRaw;

  if (key === "backspace") {
    nextValue = nextValue.slice(0, -1);
  } else if (key === ".") {
    if (!nextValue.includes(".")) {
      nextValue = `${nextValue || "0"}.`;
    }
  } else {
    nextValue = `${nextValue}${key}`;
  }

  if (activeField === "get") {
    renderFromCrypto(nextValue);
    cryptoInput.focus();
  } else {
    renderFromFiat(nextValue);
    fiatInput.focus();
  }
}

keyboardKeys.forEach((button) => {
  button.addEventListener("click", () => {
    applyKeyboardInput(button.dataset.key);
  });
});

keyboardConfirm.addEventListener("click", () => {
  closeKeyboard();
});

[payField, getField].forEach((field) => {
  field.addEventListener("mouseenter", () => setFieldHover(field, true));
  field.addEventListener("mouseleave", () => setFieldHover(field, false));
});

payField.addEventListener("click", (event) => {
  if (!event.target.closest("button")) {
    fiatInput.focus();
  }
});

getField.addEventListener("click", (event) => {
  if (!event.target.closest("button")) {
    cryptoInput.focus();
  }
});

function runEntranceSequence() {
  const steps = ["nav", "fields", "content", "summary", "ready"];
  steps.forEach((stage, index) => {
    window.setTimeout(() => {
      appShell.dataset.stage = stage;
    }, index * 30);
  });
}

summaryLargeCopy.hidden = true;
updateFiatSelector();
updateQuickActionLabels();
updateAssetFilterUi();
updateAssetModalImage();
renderFromFiat(fiatRaw);
runEntranceSequence();
