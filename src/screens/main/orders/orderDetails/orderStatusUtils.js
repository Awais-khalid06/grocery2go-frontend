import { COLORS } from "../../../../utils/theme";

export const formatStatusLabel = (status) => {
  if (status === null || status === undefined || status === "") return "-";

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
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  if (!normalized) return "neutral";

  if (
    normalized.includes("paid") ||
    normalized.includes("complete") ||
    normalized.includes("delivered") ||
    normalized.includes("accepted") ||
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
