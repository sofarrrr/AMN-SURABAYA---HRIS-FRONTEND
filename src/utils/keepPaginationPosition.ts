import type { MouseEvent } from 'react';

export function changePageKeepingPosition(
  event: MouseEvent<HTMLButtonElement>,
  changePage: () => void
) {
  const pagination = event.currentTarget.closest<HTMLElement>('[data-pagination-container]');
  const initialTop = pagination?.getBoundingClientRect().top;

  changePage();

  if (!pagination || initialTop === undefined) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const topDifference = pagination.getBoundingClientRect().top - initialTop;
      if (Math.abs(topDifference) > 1) window.scrollBy(0, topDifference);
    });
  });
}
