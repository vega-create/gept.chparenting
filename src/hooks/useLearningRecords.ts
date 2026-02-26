"use client";
import { useState, useEffect, useCallback } from "react";
import { getLearningRecords, type LearningActivity } from "@/lib/tracking";
import { useAuth } from "@/contexts/AuthContext";

interface Filters {
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useLearningRecords(initialFilters?: Filters) {
  const { user } = useAuth();
  const [records, setRecords] = useState<LearningActivity[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters ?? {});

  const fetchRecords = useCallback(async (p: number, f: Filters, append = false) => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { records: data, total: t } = await getLearningRecords(p, 20, f);
    setRecords((prev) => append ? [...prev, ...data] : data);
    setTotal(t);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    setPage(0);
    fetchRecords(0, filters);
  }, [fetchRecords, filters]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecords(nextPage, filters, true);
  }, [page, filters, fetchRecords]);

  const updateFilters = useCallback((f: Filters) => {
    setFilters(f);
  }, []);

  const hasMore = records.length < total;

  return { records, total, loading, loadMore, hasMore, filters, updateFilters };
}
