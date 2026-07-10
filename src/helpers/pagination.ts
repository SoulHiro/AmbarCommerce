export const PRODUCTS_PER_PAGE = 12

export function paginate<T>(items: T[], page: number) {
  const total      = items.length
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))
  const current    = Math.max(1, Math.min(page, totalPages))
  const slice      = items.slice((current - 1) * PRODUCTS_PER_PAGE, current * PRODUCTS_PER_PAGE)
  return { items: slice, currentPage: current, totalPages, total }
}
