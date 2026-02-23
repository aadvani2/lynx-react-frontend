export const normalizeStatus = (raw: string) => {
  const key = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[ -]+/g, "_"); // "on hold" -> "on_hold", "in process" -> "in_process"
  // Alias mapping: adjust to your UI availability
  switch (key) {
    case "rejected":
      // OPTION A: map rejected → cancelled (if no dedicated page)
      return "cancelled";
    // OPTION B (if you create a dedicated Rejected page): return "rejected";
    default:
      return key;
  }
};

export const goToRequestDetails = (setActivePage: (page: string) => void) =>
  (statusFromApi: string, requestId: number, currentPage = 1) => {
    const status = normalizeStatus(statusFromApi);
    const pageKey = `details_${status}_${requestId}_${currentPage}`;
    setActivePage(pageKey);
  };
