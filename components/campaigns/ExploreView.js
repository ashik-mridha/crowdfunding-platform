"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Label, ListBox, Select, TextField } from "@heroui/react";
import { SearchX, Search } from "lucide-react";
import { CampaignCard, CampaignCardSkeleton } from "@/components/campaigns/CampaignCard";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFetch } from "@/hooks/useFetch";
import { CATEGORIES } from "@/lib/format";

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "funded", label: "Most funded" },
  { id: "ending", label: "Ending soon" },
];
const PAGE_SIZE = 9;

const toInt = (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Math.max(0, Math.floor(Number(v))));

export function ExploreView({ detailsBase }) {
  const searchParams = useSearchParams();
  const initialCategory = CATEGORIES.includes(searchParams.get("category"))
    ? searchParams.get("category")
    : "";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("newest");
  const [minGoal, setMinGoal] = useState("");
  const [maxGoal, setMaxGoal] = useState("");
  const [page, setPage] = useState(1);

  const q = useDebouncedValue(search.trim(), 300);
  const min_goal = useDebouncedValue(toInt(minGoal), 300);
  const max_goal = useDebouncedValue(toInt(maxGoal), 300);
  const rangeInvalid = min_goal !== undefined && max_goal !== undefined && min_goal > max_goal;

  const { data, meta, loading, error, refetch } = useFetch(
    "/campaigns",
    { q: q || undefined, category: category || undefined, sort, min_goal, max_goal, page, limit: PAGE_SIZE },
    { enabled: !rangeInvalid }
  );

  const filtersActive = Boolean(search || category || minGoal || maxGoal);
  const change = (setter) => (value) => {
    setter(value);
    setPage(1);
  };
  const clear = () => {
    setSearch("");
    setCategory("");
    setMinGoal("");
    setMaxGoal("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-divider bg-surface p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <TextField value={search} onChange={change(setSearch)} className="w-full">
            <Label className="sr-only">Search campaigns</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/70"
                aria-hidden="true"
              />
              <Input placeholder="Search by title, story or creator" className="min-h-11 w-full pl-9" />
            </div>
          </TextField>
          <Select value={sort} onChange={change(setSort)} aria-label="Sort campaigns" className="md:w-52">
            <Select.Trigger className="min-h-11">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {SORTS.map((s) => (
                  <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                    {s.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {["", ...CATEGORIES].map((c) => (
            <Button
              key={c || "all"}
              size="sm"
              variant={category === c ? "primary" : "outline"}
              aria-pressed={category === c}
              className="min-h-11"
              onPress={() => change(setCategory)(c)}
            >
              {c || "All"}
            </Button>
          ))}
        </div>

        <div className="grid max-w-md grid-cols-2 gap-3">
          <TextField type="number" value={minGoal} onChange={change(setMinGoal)} isInvalid={rangeInvalid}>
            <Label>Min goal (credits)</Label>
            <Input placeholder="0" min={0} className="min-h-11" />
          </TextField>
          <TextField type="number" value={maxGoal} onChange={change(setMaxGoal)} isInvalid={rangeInvalid}>
            <Label>Max goal (credits)</Label>
            <Input placeholder="Any" min={0} className="min-h-11" />
          </TextField>
        </div>
        {rangeInvalid && (
          <p role="alert" className="text-sm text-danger">
            Maximum goal must be at least the minimum goal.
          </p>
        )}
      </div>

      <div aria-live="polite" className="text-sm text-foreground/70">
        {!loading && meta && !error && `${meta.total} campaign${meta.total === 1 ? "" : "s"} found`}
      </div>

      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : loading ? (
        <div
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          role="status"
          aria-label="Loading campaigns"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((c) => (
            <CampaignCard key={c._id} campaign={c} detailsBase={detailsBase} />
          ))}
        </div>
      ) : (
        !rangeInvalid && (
          <EmptyState
            icon={SearchX}
            title="No campaigns match your search"
            description={
              filtersActive
                ? "Try a different keyword, widen the goal range or pick another category."
                : "There are no live campaigns right now. Check back soon."
            }
          >
            {filtersActive && (
              <Button variant="secondary" className="min-h-11" onPress={clear}>
                Clear filters
              </Button>
            )}
          </EmptyState>
        )
      )}

      {meta && !error && <Pager page={meta.page} totalPages={meta.totalPages} onChange={setPage} />}
    </div>
  );
}
