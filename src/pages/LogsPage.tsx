import { useMemo, useState } from 'react';
import { DataTable } from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLogs } from '@/hooks/useLogs';
import type { Log } from '@/types';
import { formatDateTime } from '@/utils/formatters';

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 20;
  const { data, isLoading, isError, refetch } = useLogs(page, pageSize);

  const filtered = useMemo(() => {
    const list = data?.results ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (l) =>
        l.action.toLowerCase().includes(q) ||
        l.utilisateur.affichage.toLowerCase().includes(q),
    );
  }, [data, search]);

  const columns: Column<Log>[] = [
    { key: 'user', header: 'Utilisateur', cell: (r) => r.utilisateur.affichage },
    { key: 'action', header: 'Action', cell: (r) => r.action },
    {
      key: 'type',
      header: 'Type',
      cell: (r) => <Badge variant="outline">{r.type_action}</Badge>,
    },
    { key: 'ip', header: 'IP', cell: (r) => r.ip_address },
    { key: 'date', header: 'Date', cell: (r) => formatDateTime(r.timestamp) },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Journal d&apos;audit</h2>
      <Input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        isError={isError}
        totalCount={data?.count ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onRetry={() => void refetch()}
      />
    </div>
  );
}
