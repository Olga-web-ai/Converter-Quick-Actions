const screenImage = document.querySelector("#screen-image");
const dynamicRoot = document.querySelector("#dynamic-overlays");
const fxRoot = document.querySelector("#fx-overlays");
const hotspotsRoot = document.querySelector("#hotspots");
const phone = document.querySelector("#phone");

const MIN_AMOUNT = 15;
const MIN_CRYPTO = 0.0078;
const MIN_CRYPTO_TEXT = "0.0078 ETH";
const CRYPTO_SCALE = 10000;
const MAX_DIGITS = 6;
const DEFAULT_FIAT = "100";
const DEFAULT_ASSET_ID = "eth-arbitrum";
const DEFAULT_CRYPTO_TEXT = "0.0533";
const debugEnabled = new URLSearchParams(window.location.search).get("debug") === "1";

const assets = [
  {
    id: "usdt-ethereum",
    symbol: "USDT",
    subtitle: "USDT",
    network: "ethereum",
    networkLabel: "ERC-20",
    tokenIcon: "usdt",
    networkIcon: "ethereum",
    price: 0.8592,
    defaultGroup: "popular",
  },
  {
    id: "eth-arbitrum",
    symbol: "ETH",
    subtitle: "Ethereum",
    network: "arbitrum",
    networkLabel: "ARBITRUM",
    tokenIcon: "eth",
    networkIcon: "arbitrum",
    price: 1764.27,
    defaultGroup: "popular",
  },
  {
    id: "btc-bitcoin",
    symbol: "BTC",
    subtitle: "Bitcoin",
    network: "bitcoin",
    networkLabel: "",
    tokenIcon: "btc",
    networkIcon: "",
    price: 60726.86,
    defaultGroup: "popular",
  },
  {
    id: "usdt-solana",
    symbol: "USDT",
    subtitle: "USDT",
    network: "solana",
    networkLabel: "SOLANA",
    tokenIcon: "usdt",
    networkIcon: "solana",
    price: 0.8592,
    defaultGroup: "more",
  },
  {
    id: "usdt-binancesmartchain",
    symbol: "USDT",
    subtitle: "USDT",
    network: "binancesmartchain",
    networkLabel: "BNB CHAIN",
    tokenIcon: "usdt",
    networkIcon: "binancesmartchain",
    price: 0.8592,
    defaultGroup: "more",
  },
  {
    id: "usdt-polygon",
    symbol: "USDT",
    subtitle: "USDT",
    network: "polygon",
    networkLabel: "POLYGON",
    tokenIcon: "usdt",
    networkIcon: "polygon",
    price: 0.8592,
    defaultGroup: "more",
  },
  {
    id: "usdt-arbitrum",
    symbol: "USDT",
    subtitle: "USDT",
    network: "arbitrum",
    networkLabel: "ARBITRUM",
    tokenIcon: "usdt",
    networkIcon: "arbitrum",
    price: 0.8592,
    defaultGroup: "filtered",
  },
  {
    id: "usdc-solana",
    symbol: "USDC",
    subtitle: "USDC",
    network: "solana",
    networkLabel: "SOLANA",
    tokenIcon: "usdc",
    networkIcon: "solana",
    price: 0.8591,
    defaultGroup: "filtered",
  },
  {
    id: "usdc-polygon",
    symbol: "USDC",
    subtitle: "USDC",
    network: "polygon",
    networkLabel: "POLYGON",
    tokenIcon: "usdc",
    networkIcon: "polygon",
    price: 0.8591,
    defaultGroup: "filtered",
  },
  {
    id: "usdc-arbitrum",
    symbol: "USDC",
    subtitle: "USDC",
    network: "arbitrum",
    networkLabel: "ARBITRUM",
    tokenIcon: "usdc",
    networkIcon: "arbitrum",
    price: 0.8591,
    defaultGroup: "filtered",
  },
  {
    id: "usdc-binancesmartchain",
    symbol: "USDC",
    subtitle: "USDC",
    network: "binancesmartchain",
    networkLabel: "BNB CHAIN",
    tokenIcon: "usdc",
    networkIcon: "binancesmartchain",
    price: 0.8591,
    defaultGroup: "filtered",
  },
  {
    id: "usdc-base",
    symbol: "USDC",
    subtitle: "USDC",
    network: "base",
    networkLabel: "BASE",
    tokenIcon: "usdc",
    networkIcon: "base",
    price: 0.8591,
    defaultGroup: "filtered",
  },
];

const filterButtons = [
  { id: "arbitrum", label: "Arbitrum", icon: "arbitrum", w: 93, selectedW: 113, h: 32 },
  { id: "solana", label: "Solana", icon: "solana", w: 82, selectedW: 102, h: 32 },
  { id: "polygon", label: "Polygon", icon: "polygon", w: 89, selectedW: 109, h: 32 },
  { id: "binancesmartchain", label: "BNB Chain", icon: "binancesmartchain", w: 105, selectedW: 125, h: 32 },
];

const keyboardHotspots = [
  { key: "1", x: 5, y: 552, w: 123, h: 50 },
  { key: "2", x: 134, y: 552, w: 123, h: 50 },
  { key: "3", x: 263, y: 552, w: 123, h: 50 },
  { key: "4", x: 5, y: 608, w: 123, h: 50 },
  { key: "5", x: 134, y: 608, w: 123, h: 50 },
  { key: "6", x: 263, y: 608, w: 123, h: 50 },
  { key: "7", x: 5, y: 664, w: 123, h: 50 },
  { key: "8", x: 134, y: 664, w: 123, h: 50 },
  { key: "9", x: 263, y: 664, w: 123, h: 50 },
  { key: "0", x: 134, y: 720, w: 123, h: 50 },
  { key: "backspace", x: 263, y: 720, w: 123, h: 50 },
];

const fiatPresetHotspots = [
  { amount: "50", x: 28, y: 214, w: 74, h: 32 },
  { amount: "100", x: 110, y: 214, w: 82, h: 32 },
  { amount: "150", x: 201, y: 214, w: 82, h: 32 },
  { amount: "200", x: 292, y: 214, w: 82, h: 32 },
];

const screenOrder = [
  "with-points",
  "fiat-focus",
  "error",
  "asset-focus",
  "select-asset",
  "filtered",
  "select-currency",
  "activate-points",
  "terms",
  "sell",
];

const screens = {
  "with-points": {
    alt: "Buy converter screen with points enabled",
    src: "./assets/screens/with-points.png",
    hotspots: [
      { label: "Focus fiat value", x: 12, y: 106, w: 220, h: 104, to: "fiat-focus" },
      { label: "Open currency picker", x: 241, y: 138, w: 121, h: 48, to: "select-currency" },
      { label: "Focus crypto value", x: 12, y: 270, w: 220, h: 112, to: "asset-focus" },
      { label: "Open asset picker", x: 241, y: 302, w: 121, h: 48, action: "open-asset-picker" },
      { label: "Open points variant", x: 28, y: 318, w: 78, h: 24, to: "activate-points" },
      { label: "Switch to Sell", x: 141, y: 684, w: 108, h: 52, to: "sell" },
    ],
  },
  "fiat-focus": {
    alt: "Buy converter screen with fiat input focused",
    src: "./assets/screens/fiat-focus.png",
    hotspots: [
      { label: "Open currency picker", x: 241, y: 138, w: 121, h: 48, to: "select-currency" },
      { label: "Focus crypto value", x: 12, y: 270, w: 220, h: 112, action: "focus-crypto" },
      { label: "Open asset picker", x: 241, y: 302, w: 121, h: 48, action: "open-asset-picker" },
      { label: "Confirm amount", x: 331, y: 478, w: 48, h: 48, action: "submit-input" },
      { label: "Dismiss keyboard", x: 0, y: 478, w: 320, h: 48, to: "with-points" },
    ],
  },
  error: {
    alt: "Buy converter screen with minimum amount validation error",
    src: "./assets/screens/error.png",
    hotspots: [
      { label: "Open currency picker", x: 241, y: 138, w: 121, h: 48, to: "select-currency" },
      { label: "Focus crypto value", x: 12, y: 270, w: 220, h: 112, action: "focus-crypto" },
      { label: "Open asset picker", x: 241, y: 302, w: 121, h: 48, action: "open-asset-picker" },
      { label: "Confirm amount", x: 331, y: 478, w: 48, h: 48, action: "submit-input" },
    ],
  },
  "asset-focus": {
    alt: "Buy converter screen with crypto input focused",
    src: "./assets/screens/asset-focus.png",
    hotspots: [
      { label: "Focus fiat value", x: 12, y: 106, w: 220, h: 104, action: "focus-fiat" },
      { label: "Focus crypto value", x: 12, y: 270, w: 220, h: 112, action: "focus-crypto" },
      { label: "Open currency picker", x: 241, y: 138, w: 121, h: 48, to: "select-currency" },
      { label: "Open asset picker", x: 241, y: 302, w: 121, h: 48, action: "open-asset-picker" },
      { label: "Confirm crypto field", x: 331, y: 478, w: 48, h: 48, action: "submit-input" },
      { label: "Dismiss keyboard", x: 0, y: 478, w: 320, h: 48, to: "with-points" },
    ],
  },
  "select-asset": {
    alt: "Select asset sheet",
    src: "./assets/screens/select-asset.png",
    hotspots: [
      { label: "Close asset picker", x: 330, y: 74, w: 40, h: 40, to: "with-points" },
    ],
  },
  filtered: {
    alt: "Select asset sheet with selected filters",
    src: "./assets/screens/select-asset.png",
    hotspots: [
      { label: "Close asset picker", x: 330, y: 74, w: 40, h: 40, to: "with-points" },
    ],
  },
  "select-currency": {
    alt: "Select currency sheet",
    src: "./assets/screens/select-currency.png",
    hotspots: [
      { label: "Close currency picker", x: 330, y: 74, w: 40, h: 40, to: "with-points" },
      { label: "Choose Euro", x: 12, y: 275, w: 366, h: 64, to: "with-points" },
      { label: "Choose US dollar", x: 12, y: 339, w: 366, h: 64, to: "with-points" },
      { label: "Choose Australian dollar", x: 12, y: 459, w: 366, h: 64, to: "with-points" },
    ],
  },
  "activate-points": {
    alt: "Buy converter screen with activate points message",
    src: "./assets/screens/activate-points.png",
    hotspots: [
      { label: "Open boost points rules", x: 28, y: 366, w: 334, h: 60, to: "terms" },
      { label: "Open boost points rules", x: 320, y: 364, w: 58, h: 34, to: "terms" },
      { label: "Switch to Buy", x: 28, y: 684, w: 108, h: 52, to: "with-points" },
      { label: "Switch to Sell", x: 141, y: 684, w: 108, h: 52, to: "sell" },
    ],
  },
  terms: {
    alt: "Boost points rules sheet",
    src: "./assets/screens/terms.png",
    hotspots: [
      { label: "Close boost points rules", x: 330, y: 74, w: 40, h: 40, to: "activate-points" },
      { label: "Start earning points", x: 24, y: 671, w: 342, h: 52, to: "with-points" },
    ],
  },
  sell: {
    alt: "Sell converter screen",
    src: "./assets/screens/sell.png",
    hotspots: [
      { label: "Switch to Buy", x: 28, y: 684, w: 108, h: 52, to: "with-points" },
      { label: "Switch to Sell", x: 141, y: 684, w: 108, h: 52, to: "sell" },
    ],
  },
};

const measurementCanvas = document.createElement("canvas");
const measurementContext = measurementCanvas.getContext("2d");

const state = {
  screen: "with-points",
  fiatDigits: "100",
  cryptoDigits: "0533",
  selectedAssetId: "eth-arbitrum",
  assetFilters: [],
  activeInput: null,
  sourceField: "fiat",
  cryptoFresh: false,
};

const recentlyUsedAssets = [
  {
    ...assets.find((asset) => asset.id === "usdc-base"),
    networkLabel: "",
    networkIcon: "",
  },
];

function getSelectedAsset() {
  return assets.find((asset) => asset.id === state.selectedAssetId) || assets[1];
}

function isDefaultMainState() {
  return (
    state.fiatDigits === DEFAULT_FIAT &&
    state.selectedAssetId === DEFAULT_ASSET_ID &&
    state.cryptoDigits === "0533"
  );
}

function fiatNumber() {
  if (state.sourceField === "crypto") {
    return cryptoNumber() * getSelectedAsset().price;
  }
  return Number.parseFloat(state.fiatDigits || "0") || 0;
}

function cryptoText() {
  if (state.sourceField === "crypto") {
    return formatCryptoDigits(state.cryptoDigits);
  }
  if (state.fiatDigits === DEFAULT_FIAT && state.selectedAssetId === DEFAULT_ASSET_ID) {
    return DEFAULT_CRYPTO_TEXT;
  }
  return (fiatNumber() / getSelectedAsset().price).toFixed(4);
}

function cryptoNumber() {
  return (Number.parseInt(state.cryptoDigits || "0", 10) || 0) / CRYPTO_SCALE;
}

function formatCryptoDigits(digits) {
  if (digits === "") {
    return "";
  }
  return ((Number.parseInt(digits || "0", 10) || 0) / CRYPTO_SCALE).toFixed(4);
}

function rewardValue() {
  return (fiatNumber() * 0.0112).toFixed(2);
}

function rewardPoints() {
  return Math.round(fiatNumber() * 1.12);
}

function hasQuoteChanged() {
  return Math.abs(fiatNumber() - Number.parseFloat(DEFAULT_FIAT)) > 0.001;
}

function formatFiatValue() {
  if (state.sourceField === "crypto") {
    return fiatNumber().toFixed(2).replace(/\.00$/, "");
  }
  return state.fiatDigits;
}

function formatFiatMoney() {
  return `€${fiatNumber().toFixed(2)}`;
}

function formatPrice(value) {
  return `€${value.toFixed(value < 10 ? 4 : 2)}`;
}

function formatSummary() {
  return `${cryptoText()} ${getSelectedAsset().symbol} for ${formatFiatMoney()}`;
}

function positionNode(node, rect) {
  node.style.left = `${(rect.x / 390) * 100}%`;
  node.style.top = `${(rect.y / 844) * 100}%`;
  node.style.width = `${(rect.w / 390) * 100}%`;
  node.style.height = `${(rect.h / 844) * 100}%`;
}

function measureTextWidth(text, font) {
  measurementContext.font = font;
  return measurementContext.measureText(text).width;
}

function setHash(screen) {
  if (window.location.hash !== `#${screen}`) {
    window.location.hash = screen;
  }
}

function getFilterLayout() {
  let x = 12;
  return filterButtons.map((button) => {
    const selected = state.assetFilters.includes(button.id);
    const width = selected ? button.selectedW : button.w;
    const rect = { ...button, x, y: 155, w: width, selected };
    x += width + 8;
    return rect;
  });
}

function setScreen(screen) {
  if (!screens[screen]) {
    return;
  }

  if (screen === "fiat-focus") {
    state.activeInput = "fiat";
  }

  if (screen === "asset-focus") {
    state.activeInput = "crypto";
    state.cryptoFresh = true;
  }

  if (screen === "with-points") {
    state.activeInput = null;
    state.cryptoFresh = false;
  }

  state.screen = screen;
  render();
  setHash(screen);
}

function openAssetPicker() {
  state.assetFilters = [];
  setScreen("select-asset");
}

function toggleFilter(network) {
  const exists = state.assetFilters.includes(network);
  state.assetFilters = exists
    ? state.assetFilters.filter((item) => item !== network)
    : [...state.assetFilters, network];
  setScreen(state.assetFilters.length === 0 ? "select-asset" : "filtered");
}

function selectAsset(assetId) {
  state.selectedAssetId = assetId;
  state.assetFilters = [];
  setScreen("with-points");
}

function focusFiatInput() {
  if (state.activeInput === "crypto") {
    state.fiatDigits = Math.round(fiatNumber()).toString();
  }
  state.activeInput = "fiat";
  state.sourceField = "fiat";
  state.cryptoFresh = false;
  setScreen(fiatNumber() < MIN_AMOUNT ? "error" : "fiat-focus");
}

function focusCryptoInput() {
  if (state.activeInput !== "crypto") {
    state.cryptoDigits = cryptoText().replace(".", "");
  }
  state.activeInput = "crypto";
  state.sourceField = "crypto";
  state.cryptoFresh = true;
  setScreen("asset-focus");
}

function pressKey(name, rect) {
  flashKey(rect);

  if (state.activeInput === "crypto") {
    state.sourceField = "crypto";
    if (name === "backspace") {
      if (state.cryptoFresh) {
        state.cryptoDigits = "";
        state.cryptoFresh = false;
      } else {
        state.cryptoDigits = state.cryptoDigits.length > 1 ? state.cryptoDigits.slice(0, -1) : "";
      }
    } else {
      if (state.cryptoFresh) {
        state.cryptoDigits = name;
        state.cryptoFresh = false;
      } else if (state.cryptoDigits.length < MAX_DIGITS) {
        state.cryptoDigits = state.cryptoDigits === "0" ? name : `${state.cryptoDigits}${name}`;
      }
    }

    state.screen = "asset-focus";
    render();
    setHash("asset-focus");
    return;
  }

  if (name === "backspace") {
    state.sourceField = "fiat";
    state.fiatDigits = state.fiatDigits.length > 1 ? state.fiatDigits.slice(0, -1) : "";
  } else if (state.fiatDigits.length < MAX_DIGITS) {
    state.sourceField = "fiat";
    state.fiatDigits = state.fiatDigits === "" ? name : `${state.fiatDigits}${name}`;
  }

  state.screen = fiatNumber() < MIN_AMOUNT ? "error" : "fiat-focus";
  render();
  setHash(state.screen);
}

function submitCurrentInput() {
  if (state.activeInput === "crypto") {
    if (cryptoNumber() < MIN_CRYPTO) {
      state.screen = "asset-focus";
      render();
      setHash("asset-focus");
      return;
    }
    setScreen("with-points");
    return;
  }

  if (fiatNumber() < MIN_AMOUNT) {
    state.screen = "error";
    render();
    setHash("error");
    return;
  }

  setScreen("with-points");
}

function applyFiatPreset(amount) {
  state.fiatDigits = amount;
  state.sourceField = "fiat";
  if (state.screen === "fiat-focus" || state.screen === "error") {
    state.screen = Number.parseInt(amount, 10) < MIN_AMOUNT ? "error" : "fiat-focus";
    render();
    setHash(state.screen);
    return;
  }

  setScreen("with-points");
}

function flashKey(rect) {
  fxRoot.innerHTML = "";
  const flash = document.createElement("div");
  flash.className = "key-flash";
  positionNode(flash, rect);
  fxRoot.appendChild(flash);
  window.setTimeout(() => flash.remove(), 160);
}

function createMask(rect, className) {
  const node = document.createElement("div");
  node.className = className;
  positionNode(node, rect);
  dynamicRoot.appendChild(node);
  return node;
}

function createScreenSliceMask(rect, src = screens[state.screen].src) {
  const node = document.createElement("div");
  node.className = "screen-slice-mask";
  positionNode(node, rect);

  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.draggable = false;
  img.style.width = `${(780 / rect.w) * 100}%`;
  img.style.height = `${(1688 / rect.h) * 100}%`;
  img.style.left = `${((-rect.x * 2) / rect.w) * 100}%`;
  img.style.top = `${((-rect.y * 2) / rect.h) * 100}%`;

  node.appendChild(img);
  dynamicRoot.appendChild(node);
  return node;
}

function createTextMask({ rect, className, text }) {
  const mask = createMask(rect, "value-mask");
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  mask.appendChild(span);
  return mask;
}

function createLabelText({ x, y, text, className }) {
  const label = createMask({ x, y, w: 120, h: 15 }, "label-mask");
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  label.appendChild(span);
  return label;
}

function createTextOverlay({ rect, className, text }) {
  const label = createMask(rect, "label-mask");
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  label.appendChild(span);
  return label;
}

function createMeasuredTextMask({
  x,
  y,
  text,
  textClass,
  font,
  height,
  padding = 6,
  minWidth = 0,
}) {
  const width = Math.max(measureTextWidth(text, font) + padding * 2, minWidth);
  return createTextMask({
    rect: { x, y, w: width, h: height },
    className: textClass,
    text,
  });
}

function createSummaryMask({ rect, text }) {
  const mask = createMask(rect, "value-mask summary");
  const span = document.createElement("span");
  span.className = "value-text summary";
  span.textContent = text;
  mask.appendChild(span);
  return mask;
}

function createButtonMask({ rect, text }) {
  const width = Math.max(measureTextWidth(text, '600 18px "ES Rebond Grotesque"') + 18, 124);
  const textRect = {
    x: rect.x + (rect.w - width) / 2,
    y: rect.y + 14,
    w: width,
    h: 24,
  };
  const mask = createMask(textRect, "value-mask button");
  const span = document.createElement("span");
  span.className = "value-text button";
  span.textContent = text;
  mask.appendChild(span);
}

function createTimerRing({ x, y, size = 16 }) {
  const ring = document.createElement("div");
  ring.className = "timer-ring";
  positionNode(ring, { x, y, w: size, h: size });

  const radius = 5;
  const circumference = 2 * Math.PI * radius;
  ring.innerHTML = `
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle
        class="timer-ring-track"
        cx="8"
        cy="8"
        r="${radius}"
      ></circle>
      <circle
        class="timer-ring-progress"
        cx="8"
        cy="8"
        r="${radius}"
        stroke-dasharray="${circumference} 0"
        stroke-dashoffset="0"
      ></circle>
    </svg>
  `;

  dynamicRoot.appendChild(ring);
}

function createTimerRow({ x, y, text }) {
  const textWidth = measureTextWidth(text, '400 11px "Suisse Intl"');
  createMask(
    {
      x: x - 2,
      y: y - 2,
      w: textWidth + 26,
      h: 18,
    },
    "value-mask timer-row-mask"
  );
  createLabelText({
    x,
    y,
    text,
    className: "value-text timer",
  });
  createTimerRing({
    x: x + textWidth + 2,
    y: y - 1,
  });
}

function createCaret({ x, y, value, font, height, offset = 0 }) {
  const caret = document.createElement("div");
  caret.className = "caret";
  const textWidth = measureTextWidth(value, font);
  positionNode(caret, {
    x: x + textWidth + offset,
    y,
    w: 2,
    h: height,
  });
  dynamicRoot.appendChild(caret);
}

function createAssetChip(rect) {
  const asset = getSelectedAsset();
  const mask = createMask(rect, "value-mask asset-chip-mask");
  const chip = document.createElement("div");
  chip.className = "asset-chip";

  const iconWrap = document.createElement("div");
  iconWrap.className = "chip-icon-wrap";

  const token = document.createElement("img");
  token.className = "chip-token-icon";
  token.src = `./assets/icons/tokens/${asset.tokenIcon}.png`;
  token.alt = "";
  iconWrap.appendChild(token);

  if (asset.networkIcon) {
    const network = document.createElement("img");
    network.className = "chip-network-icon";
    network.src = `./assets/icons/networks/${asset.networkIcon}.png`;
    network.alt = "";
    iconWrap.appendChild(network);
  }

  const label = document.createElement("span");
  label.className = "chip-label";
  label.textContent = asset.symbol;

  const chevron = document.createElement("span");
  chevron.className = "chip-chevron";
  chevron.textContent = "⌄";

  chip.append(iconWrap, label, chevron);
  mask.appendChild(chip);
}

function createSummaryIcon(rect) {
  const asset = getSelectedAsset();
  const wrap = createMask(rect, "asset-summary-icon");
  const token = document.createElement("img");
  token.className = "summary-token-icon";
  token.src = `./assets/icons/tokens/${asset.tokenIcon}.png`;
  token.alt = "";
  wrap.appendChild(token);
  if (asset.networkIcon) {
    const network = document.createElement("img");
    network.className = "summary-network-icon";
    network.src = `./assets/icons/networks/${asset.networkIcon}.png`;
    network.alt = "";
    wrap.appendChild(network);
  }
}

function getVisibleAssetGroups() {
  if (state.assetFilters.length === 0) {
    return {
      recent: recentlyUsedAssets,
      popular: assets.filter((asset) => asset.defaultGroup === "popular"),
      more: assets.filter((asset) => asset.defaultGroup === "more"),
    };
  }

  const filtered = assets
    .filter((asset) => state.assetFilters.includes(asset.network))
    .sort(
      (a, b) =>
        state.assetFilters.indexOf(a.network) - state.assetFilters.indexOf(b.network) ||
        a.symbol.localeCompare(b.symbol),
    );

  return { assets: filtered };
}

function renderAssetPickerUI() {
  const filters = createMask({ x: 0, y: 145, w: 390, h: 42 }, "asset-picker-layer");
  const scroll = document.createElement("div");
  scroll.className = "asset-picker-scroll";
  filters.appendChild(scroll);

  getFilterLayout().forEach((button) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = button.selected ? "filter-chip-ui selected" : "filter-chip-ui";
    chip.style.width = `${button.w}px`;
    chip.style.height = `${button.h}px`;
    chip.setAttribute("aria-label", `${button.selected ? "Remove" : "Apply"} ${button.label} filter`);
    chip.addEventListener("click", () => toggleFilter(button.id));

    const icon = document.createElement("img");
    icon.className = "filter-chip-icon";
    icon.src = `./assets/icons/networks/${button.icon}.png`;
    icon.alt = "";

    const label = document.createElement("span");
    label.className = "filter-chip-text";
    label.textContent = button.label;

    chip.append(icon, label);

    if (button.selected) {
      const close = document.createElement("span");
      close.className = "filter-chip-close";
      close.textContent = "×";
      chip.appendChild(close);
    }

    scroll.appendChild(chip);
  });

  const listLayer = createMask({ x: 0, y: 271, w: 390, h: 461 }, "asset-list-layer");
  const groups = getVisibleAssetGroups();
  let currentY = 0;

  const appendHeader = (text) => {
    const header = document.createElement("div");
    header.className = "asset-section-title";
    header.style.top = `${currentY + 27}px`;
    header.textContent = text;
    listLayer.appendChild(header);
    currentY += 56;
  };

  const appendRow = (asset) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "asset-row-ui";
    row.style.top = `${currentY}px`;
    row.setAttribute("aria-label", `Select ${asset.symbol}${asset.network ? ` on ${asset.network}` : ""}`);
    row.addEventListener("click", () => selectAsset(asset.id));

    const token = document.createElement("img");
    token.className = "asset-row-token";
    token.src = `./assets/icons/tokens/${asset.tokenIcon}.png`;
    token.alt = "";

    const text = document.createElement("div");
    text.className = "asset-row-text";

    const topLine = document.createElement("div");
    topLine.className = "asset-row-top";

    const symbol = document.createElement("span");
    symbol.className = "asset-row-symbol";
    symbol.textContent = asset.symbol;
    topLine.appendChild(symbol);

    if (asset.networkLabel) {
      const pill = document.createElement("span");
      pill.className = "asset-row-network-pill";
      if (asset.networkIcon) {
        const pillIcon = document.createElement("img");
        pillIcon.className = "asset-row-network-icon";
        pillIcon.src = `./assets/icons/networks/${asset.networkIcon}.png`;
        pillIcon.alt = "";
        pill.appendChild(pillIcon);
      }
      const pillText = document.createElement("span");
      pillText.textContent = asset.networkLabel;
      pill.appendChild(pillText);
      topLine.appendChild(pill);
    }

    const subtitle = document.createElement("div");
    subtitle.className = "asset-row-subtitle";
    subtitle.textContent = asset.subtitle;

    text.append(topLine, subtitle);

    const price = document.createElement("div");
    price.className = "asset-row-price";
    price.textContent = formatPrice(asset.price);

    row.append(token, text, price);
    listLayer.appendChild(row);
    currentY += 64;
  };

  if (state.screen === "filtered") {
    appendHeader("Assets");
    groups.assets.forEach(appendRow);
    return;
  }

  appendHeader("Recently used");
  groups.recent.forEach(appendRow);
  appendHeader("Popular assets");
  groups.popular.forEach(appendRow);
  appendHeader("More assets");
  groups.more.forEach(appendRow);
}

function renderConverterOverlays() {
  const converterScreens = new Set(["with-points", "fiat-focus", "error", "asset-focus", "activate-points"]);
  if (!converterScreens.has(state.screen)) {
    return;
  }

  const fiat = formatFiatValue();
  const crypto = cryptoText();
  const summary = formatSummary();
  const payText = `Pay ${formatFiatMoney()}`;
  const asset = getSelectedAsset();
  const fiatChanged = hasQuoteChanged();
  const assetChanged = state.selectedAssetId !== DEFAULT_ASSET_ID;
  const dynamicMain = fiatChanged || assetChanged;
  const defaultAsset = assets.find((item) => item.id === DEFAULT_ASSET_ID);
  const defaultSummary = `${(Number.parseInt(DEFAULT_FIAT, 10) / defaultAsset.price).toFixed(4)} ${defaultAsset.symbol} for €100.00`;
  const defaultPayText = "Pay €100.00";
  const displayFont = '500 44px "ES Rebond Grotesque"';
  const focusedDisplay = ["fiat-focus", "error"].includes(state.screen);
  const topValueY = focusedDisplay ? 140 : 138;
  const topValueH = focusedDisplay ? 44 : 48;
  const cryptoValueY = state.screen === "asset-focus" ? 304 : 302;
  const cryptoValueH = state.screen === "asset-focus" ? 44 : 48;
  const topMaskClass = ["fiat-focus", "error"].includes(state.screen) ? "value-mask focus-surface" : "value-mask";
  const cryptoMaskClass = state.screen === "asset-focus" ? "value-mask focus-surface" : "value-mask";
  const topValueMaskRect = {
    x: 24,
    y: focusedDisplay ? 140 : 138,
    w: 182,
    h: focusedDisplay ? 46 : 50,
  };
  const cryptoValueMaskRect = {
    x: 24,
    y: state.screen === "asset-focus" ? 304 : 302,
    w: 194,
    h: state.screen === "asset-focus" ? 46 : 44,
  };

  if (
    ["with-points", "fiat-focus", "error", "asset-focus", "activate-points"].includes(state.screen) &&
    fiatChanged
  ) {
    createMask(topValueMaskRect, topMaskClass);
    createTextOverlay({
      rect: {
        x: 28,
        y: topValueY,
        w: topValueMaskRect.w - 12,
        h: topValueH,
      },
      className: "value-text display",
      text: fiat,
    });
  }

  if (dynamicMain) {
    createMask(cryptoValueMaskRect, cryptoMaskClass);
    createTextOverlay({
      rect: {
        x: 28,
        y: cryptoValueY,
        w: cryptoValueMaskRect.w - 12,
        h: cryptoValueH,
      },
      className: "value-text display",
      text: crypto,
    });
  }

  if (
    ["with-points", "activate-points", "asset-focus", "fiat-focus", "error"].includes(state.screen) &&
    assetChanged
  ) {
    createAssetChip({ x: 241, y: 302, w: 121, h: 48 });
  }

  if (["with-points", "activate-points"].includes(state.screen)) {
    const timerX = state.screen === "with-points" ? 85 : 28;
    const timerY = state.screen === "with-points" ? 351 : 350;
    const timerText = "Updates in 5s";
    createTimerRow({ x: timerX, y: timerY, text: timerText });

    if (dynamicMain) {
      if (assetChanged) {
        createSummaryIcon({ x: 28, y: state.screen === "with-points" ? 528 : 536, w: 40, h: 40 });
      }
      createSummaryMask({
        rect: {
          x: 84,
          y: state.screen === "with-points" ? 536 : 544,
          w: Math.max(
            measureTextWidth(summary, '400 17px "Suisse Intl"') + 10,
            measureTextWidth(defaultSummary, '400 17px "Suisse Intl"') + 10
          ),
          h: 24,
        },
        text: summary,
      });
      createButtonMask({
        rect: {
          x: 24,
          y: 600,
          w: 342,
          h: 51,
        },
        text: payText,
      });

    }
  }

  if (state.screen === "fiat-focus" || state.screen === "error") {
    createCaret({
      x: 28,
      y: 142,
      value: fiat,
      font: '500 44px "ES Rebond Grotesque"',
      height: 40,
      offset: 2,
    });
  }

  if (state.screen === "asset-focus") {
    createCaret({
      x: 28,
      y: 306,
      value: crypto,
      font: '500 44px "ES Rebond Grotesque"',
      height: 40,
      offset: 2,
    });

    if (state.activeInput === "crypto" && cryptoNumber() < MIN_CRYPTO) {
      createMask({ x: 24, y: 346, w: 252, h: 24 }, "value-mask focus-surface");
      createTextOverlay({
        rect: { x: 28, y: 350, w: 190, h: 16 },
        className: "value-text helper error",
        text: `Minimum amount – ${MIN_CRYPTO_TEXT}`,
      });
    }
  }

  if (state.screen === "error") {
    createMask({ x: 24, y: 183, w: 252, h: 24 }, "value-mask focus-surface");
    createTextOverlay({
      rect: { x: 28, y: 187, w: 210, h: 16 },
      className: "value-text helper error",
      text: `Minimum amount – ${MIN_AMOUNT.toFixed(2)} EUR`,
    });
  }

}

function renderDynamicOverlays() {
  dynamicRoot.innerHTML = "";

  renderConverterOverlays();

  if (state.screen === "select-asset" || state.screen === "filtered") {
    renderAssetPickerUI();
  }
}

function buildDynamicHotspots() {
  const list = [];

  if (["with-points", "fiat-focus", "error"].includes(state.screen)) {
    fiatPresetHotspots.forEach((preset) => {
      list.push({
        label: `Set amount ${preset.amount} euro`,
        x: preset.x,
        y: preset.y,
        w: preset.w,
        h: preset.h,
        action: "preset-fiat",
        amount: preset.amount,
      });
    });
  }

  if (["fiat-focus", "error", "asset-focus"].includes(state.screen)) {
    keyboardHotspots.forEach((key) => {
      list.push({
        label: `Keyboard ${key.key}`,
        x: key.x,
        y: key.y,
        w: key.w,
        h: key.h,
        action: "keyboard",
        key: key.key,
      });
    });
  }

  return list;
}

function renderHotspots() {
  hotspotsRoot.innerHTML = "";
  const hotspots = [...screens[state.screen].hotspots, ...buildDynamicHotspots()];

  hotspots.forEach((spot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.setAttribute("aria-label", spot.label);
    positionNode(button, spot);

    button.addEventListener("click", () => {
      if (spot.action === "keyboard") {
        pressKey(spot.key, spot);
        return;
      }

      if (spot.action === "submit-input") {
        submitCurrentInput();
        return;
      }

      if (spot.action === "open-asset-picker") {
        openAssetPicker();
        return;
      }

      if (spot.action === "preset-fiat") {
        applyFiatPreset(spot.amount);
        return;
      }

      if (spot.action === "focus-fiat") {
        focusFiatInput();
        return;
      }

      if (spot.action === "focus-crypto") {
        focusCryptoInput();
        return;
      }

      if (spot.action === "filter") {
        toggleFilter(spot.filter);
        return;
      }

      if (spot.action === "select-asset") {
        selectAsset(spot.assetId);
        return;
      }

      if (spot.to) {
        setScreen(spot.to);
      }
    });

    hotspotsRoot.appendChild(button);
  });
}

function render() {
  const screen = screens[state.screen];
  phone.classList.add("is-transitioning");
  phone.dataset.debug = String(debugEnabled);
  screenImage.src = screen.src;
  screenImage.alt = screen.alt;
  renderDynamicOverlays();
  renderHotspots();
  window.setTimeout(() => phone.classList.remove("is-transitioning"), 120);
}

function step(direction) {
  const currentIndex = screenOrder.indexOf(state.screen);
  const nextIndex = (currentIndex + direction + screenOrder.length) % screenOrder.length;
  setScreen(screenOrder[nextIndex]);
}

window.addEventListener("hashchange", () => {
  const next = window.location.hash.slice(1);
  if (screens[next] && next !== state.screen) {
    state.screen = next;
    render();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    step(1);
  }
  if (event.key === "ArrowLeft") {
    step(-1);
  }
  if (event.key.toLowerCase() === "r") {
    setScreen("with-points");
  }
});

async function init() {
  const hash = window.location.hash.slice(1);
  if (screens[hash]) {
    state.screen = hash;
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  render();
  setHash(state.screen);
}

init();
