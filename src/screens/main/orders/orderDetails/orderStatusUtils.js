import { COLORS } from "../../../../utils/theme";

const ORDER_STATUS_LABEL_MAP = {
  "accept by owner": "Accepted by Owner",
  "accepted by owner": "Accepted by Owner",
  "accept by rider": "Accepted by Rider",
  "accepted by rider": "Accepted by Rider",
  "buying grocery": "Buying Groceries",
  "buy groceries": "Buying Groceries",
  "ready for pickup": "Ready for Pickup",
  "on the way": "On the Way",
  "order placed": "Order Placed",
  "order completed": "Order Completed",
};

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .toLowerCase();

export const formatStatusLabel = (status) => {
  if (status === null || status === undefined || status === "") return "-";

  const normalized = normalizeStatus(status);

  if (ORDER_STATUS_LABEL_MAP[normalized]) {
    return ORDER_STATUS_LABEL_MAP[normalized];
  }

  return String(status)
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getStatusTone = (status) => {
  const normalized = normalizeStatus(status);

  if (!normalized) return "neutral";

  if (
    normalized.includes("paid") ||
    normalized.includes("complete") ||
    normalized.includes("delivered") ||
    normalized.includes("accepted") ||
    normalized.startsWith("accept") ||
    normalized.includes("ready") ||
    normalized.includes("success")
  ) {
    return "success";
  }

  if (
    normalized.includes("reject") ||
    normalized.includes("cancel") ||
    normalized.includes("fail") ||
    normalized.includes("unpaid") ||
    normalized.includes("declin")
  ) {
    return "danger";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("new") ||
    normalized.includes("process") ||
    normalized.includes("progress") ||
    normalized.includes("arriv") ||
    normalized.includes("pick")
  ) {
    return "info";
  }

  return "neutral";
};

export const getStatusBadgeColors = (status) => {
  const tone = getStatusTone(status);

  if (tone === "success") {
    return {
      backgroundColor: "rgba(29, 197, 96, 0.12)",
      textColor: COLORS.green,
    };
  }

  if (tone === "danger") {
    return {
      backgroundColor: "rgba(255, 77, 79, 0.12)",
      textColor: COLORS.danger,
    };
  }

  if (tone === "info") {
    return {
      backgroundColor: "rgba(14, 160, 232, 0.12)",
      textColor: COLORS.blue,
    };
  }

  return {
    backgroundColor: "rgba(127, 127, 127, 0.12)",
    textColor: COLORS.textGray,
  };
};
