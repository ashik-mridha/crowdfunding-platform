"use client";

import { Pagination } from "@heroui/react";

function pageWindow(page, total) {
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <Pagination className="justify-center">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous isDisabled={page === 1} onPress={() => onChange(page - 1)}>
            <Pagination.PreviousIcon />
            Prev
          </Pagination.Previous>
        </Pagination.Item>
        {pageWindow(page, totalPages).map((p, i) =>
          p === "gap" ? (
            <Pagination.Item key={`gap-${i}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} aria-label={`Page ${p}`} onPress={() => onChange(p)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          )
        )}
        <Pagination.Item>
          <Pagination.Next isDisabled={page === totalPages} onPress={() => onChange(page + 1)}>
            Next
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
