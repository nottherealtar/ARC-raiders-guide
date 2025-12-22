'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search, Trophy, Target } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type QuestReward = {
  id: string;
  quantity: number;
  itemId: string;
};

type Quest = {
  id: string;
  name: string;
  objectives: string[];
  xp: number;
  granted_items: any;
  locations: any;
  marker_category: string | null;
  image: string | null;
  guide_links: any;
  required_items: any;
  rewards: QuestReward[];
};

export function QuestsDataTable() {
  const router = useRouter();
  const [data, setData] = React.useState<Quest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  const columns: ColumnDef<Quest>[] = [
    {
      accessorKey: 'image',
      header: 'الصورة',
      cell: ({ row }) => (
        <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded-md overflow-hidden">
          {row.original.image ? (
            <Image
              src={row.original.image}
              alt={row.original.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Target className="w-6 h-6" />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'اسم المهمة',
      cell: ({ row }) => (
        <div className="font-medium text-lg">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'objectives',
      header: 'الأهداف',
      cell: ({ row }) => {
        const objectives = row.original.objectives;
        return (
          <div className="max-w-xl">
            {objectives.length > 0 ? (
              <div className="text-sm text-muted-foreground line-clamp-2">
                {objectives[0]}
                {objectives.length > 1 && (
                  <span className="text-xs mr-1">
                    (+{objectives.length - 1} المزيد)
                  </span>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">لا توجد أهداف</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'xp',
      header: 'الخبرة',
      cell: ({ row }) => {
        const xp = row.getValue('xp') as number;
        return (
          <div className="flex items-center gap-1 text-amber-500 font-medium">
            <Trophy className="w-4 h-4" />
            {xp.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'rewards',
      header: 'المكافآت',
      cell: ({ row }) => {
        const rewards = row.original.rewards;
        return (
          <div className="text-center font-medium">
            {rewards.length > 0 ? (
              <span className="text-green-500">{rewards.length} مكافأة</span>
            ) : (
              <span className="text-muted-foreground">لا توجد</span>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (search !== debouncedSearch) {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  const fetchQuests = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      const response = await fetch(`/api/quests?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalCount(result.pagination.totalCount);
      }
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch]);

  React.useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن المهام..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border" dir="ltr">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => router.push(`/quests/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          عرض {data.length > 0 ? (page - 1) * pageSize + 1 : 0} إلى{' '}
          {Math.min(page * pageSize, totalCount)} من {totalCount} مهمة
        </div>

        <div className="flex items-center gap-2">
          {/* Page Size Selector */}
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / صفحة</SelectItem>
              <SelectItem value="20">20 / صفحة</SelectItem>
              <SelectItem value="50">50 / صفحة</SelectItem>
            </SelectContent>
          </Select>

          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || loading}
          >
            السابق
          </Button>

          {/* Page Info */}
          <div className="text-sm font-medium">
            صفحة {page} من {totalPages}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages || loading}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}
