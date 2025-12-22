'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';
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

type ArcLoot = {
  id: string;
  item: {
    id: string;
    name: string;
    icon: string | null;
    rarity: string | null;
    item_type: string | null;
  };
};

type Arc = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  image: string | null;
  loot: ArcLoot[];
};

const getRarityColor = (rarity: string | null) => {
  switch (rarity) {
    case 'COMMON':
      return 'text-gray-500';
    case 'UNCOMMON':
      return 'text-green-500';
    case 'RARE':
      return 'text-blue-500';
    case 'EPIC':
      return 'text-purple-500';
    case 'LEGENDARY':
      return 'text-orange-500';
    default:
      return 'text-muted-foreground';
  }
};

export function ArcsDataTable() {
  const router = useRouter();
  const [data, setData] = React.useState<Arc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  const columns: ColumnDef<Arc>[] = [
    {
      accessorKey: 'icon',
      header: 'الأيقونة',
      cell: ({ row }) => (
        <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded-md overflow-hidden">
          {row.original.icon ? (
            <Image
              src={row.original.icon}
              alt={row.original.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              غير متوفر
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'الاسم',
      cell: ({ row }) => (
        <div className="font-medium text-lg">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'الوصف',
      cell: ({ row }) => (
        <div className="max-w-2xl text-sm text-muted-foreground line-clamp-2">
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'loot',
      header: 'عدد المواد',
      cell: ({ row }) => {
        const loot = row.original.loot;
        return (
          <div className="text-center font-medium">
            {loot.length}
          </div>
        );
      },
    },
    {
      id: 'topLoot',
      header: 'أهم المواد',
      cell: ({ row }) => {
        const loot = row.original.loot;
        const topLoot = loot.slice(0, 3);

        if (topLoot.length === 0) {
          return <div className="text-sm text-muted-foreground">لا توجد مواد</div>;
        }

        return (
          <div className="flex gap-2">
            {topLoot.map((lootItem) => (
              <div
                key={lootItem.id}
                className="relative w-8 h-8 bg-muted rounded overflow-hidden"
                title={lootItem.item.name}
              >
                {lootItem.item.icon ? (
                  <Image
                    src={lootItem.item.icon}
                    alt={lootItem.item.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    ?
                  </div>
                )}
              </div>
            ))}
            {loot.length > 3 && (
              <div className="flex items-center text-xs text-muted-foreground">
                +{loot.length - 3}
              </div>
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

  const fetchArcs = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      const response = await fetch(`/api/arcs?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalCount(result.pagination.totalCount);
      }
    } catch (error) {
      console.error('Error fetching ARCs:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch]);

  React.useEffect(() => {
    fetchArcs();
  }, [fetchArcs]);

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
            placeholder="ابحث عن وحدات ARC..."
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
                  onClick={() => router.push(`/arcs/${row.original.id}`)}
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
          {Math.min(page * pageSize, totalCount)} من {totalCount} وحدة ARC
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
