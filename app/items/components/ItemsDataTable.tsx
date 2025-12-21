'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

type Item = {
  id: string;
  name: string;
  description: string;
  item_type: string | null;
  icon: string | null;
  rarity: string | null;
  value: number;
  weight: number;
};

const ITEM_TYPES = [
  'ADVANCED_MATERIAL',
  'AMMUNITION',
  'AUGMENT',
  'BASIC_MATERIAL',
  'BLUEPRINT',
  'CONSUMABLE',
  'COSMETIC',
  'GADGET',
  'KEY',
  'MATERIAL',
  'MEDICAL',
  'MISC',
  'MODIFICATION',
  'MODS',
  'NATURE',
  'QUEST_ITEM',
  'QUICK_USE',
  'RECYCLABLE',
  'REFINED_MATERIAL',
  'REFINEMENT',
  'SHIELD',
  'THROWABLE',
  'TOPSIDE_MATERIAL',
  'TRINKET',
  'WEAPON',
];

const RARITIES = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];

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

const formatEnumValue = (value: string | null) => {
  if (!value) return '-';
  return value
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export function ItemsDataTable() {
  const router = useRouter();
  const [data, setData] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [rarityFilter, setRarityFilter] = React.useState<string>('all');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: 'icon',
      header: 'الأيقونة',
      cell: ({ row }) => (
        <div className="relative w-10 h-10 flex-shrink-0 bg-muted rounded-md overflow-hidden">
          {row.original.icon ? (
            <Image
              src={row.original.icon}
              alt={row.original.name}
              fill
              className="object-cover"
              sizes="40px"
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
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'الوصف',
      cell: ({ row }) => (
        <div className="max-w-md text-sm text-muted-foreground line-clamp-2">
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'rarity',
      header: 'الندرة',
      cell: ({ row }) => {
        const rarity = row.getValue('rarity') as string | null;
        return (
          <div className={`font-medium ${getRarityColor(rarity)}`}>
            {formatEnumValue(rarity)}
          </div>
        );
      },
    },
    {
      accessorKey: 'value',
      header: () => <div className="text-right">القيمة</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue('value') || 0}
        </div>
      ),
    },
    {
      accessorKey: 'weight',
      header: () => <div className="text-right">الوزن</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue('weight') || 0}
        </div>
      ),
    },
    {
      accessorKey: 'item_type',
      header: 'النوع',
      cell: ({ row }) => (
        <div className="text-sm">
          {formatEnumValue(row.getValue('item_type'))}
        </div>
      ),
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
        setPage(1); // Reset to first page when search actually changes
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  const fetchItems = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      if (typeFilter !== 'all') {
        params.append('type', typeFilter);
      }

      if (rarityFilter !== 'all') {
        params.append('rarity', rarityFilter);
      }

      const response = await fetch(`/api/items?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalCount(result.pagination.totalCount);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, typeFilter, rarityFilter]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleRarityFilterChange = (value: string) => {
    setRarityFilter(value);
    setPage(1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن العناصر..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {ITEM_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {formatEnumValue(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rarity Filter */}
        <Select value={rarityFilter} onValueChange={handleRarityFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="تصفية حسب الندرة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الندرات</SelectItem>
            {RARITIES.map((rarity) => (
              <SelectItem key={rarity} value={rarity}>
                <span className={getRarityColor(rarity)}>
                  {formatEnumValue(rarity)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              الأعمدة <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border"  dir="ltr">
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
                  onClick={() => router.push(`/items/${row.original.id}`)}
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
          {Math.min(page * pageSize, totalCount)} من {totalCount} عنصر
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
              <SelectItem value="100">100 / صفحة</SelectItem>
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
