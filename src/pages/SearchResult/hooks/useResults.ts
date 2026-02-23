import { useMemo } from "react";
import type { ApiResponse, ResultItem } from "../types";

export function useResults(
  apiResponse: ApiResponse | null,
  providerSearchQuery: string,
  fallbackImage?: string
): ResultItem[] {
  return useMemo<ResultItem[]>(() => {
    // Use API response data if available, otherwise show empty array
    if (!apiResponse?.providers) return [];

    const apiResults = apiResponse.providers.map(provider => ({
      id: provider.id.toString(),
      name: provider.name,
      distance: provider.distance,
      rating: provider.avg_rating?.toString() || "0",
      rating_count: provider.rating_count?.toString() || "0",
      reviews: provider.rating_count?.toString() || "0", // Use rating_count from API for total reviews
      description: provider.bio,
      // Always show category image for search cards (ignore provider image)
      image: fallbackImage || "",
      established: provider.exp?.toString() || "0"
    }));

    if (!providerSearchQuery.trim()) return apiResults;
    const q = providerSearchQuery.toLowerCase().trim();
    return apiResults.filter(r => r.name && r.name.toLowerCase().includes(q));
  }, [apiResponse, providerSearchQuery, fallbackImage]);
}
