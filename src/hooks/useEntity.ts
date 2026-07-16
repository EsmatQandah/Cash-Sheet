import { useCallback, useEffect, useState } from "react";

interface CrudApi<T> {
  list: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number, data: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

export function useEntity<T>(api: CrudApi<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await api.list();
    setRows(data);
    setLoading(false);
  }, [api]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, refresh, api };
}
