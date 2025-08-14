export function offsetCalculator(filterPage: number, filterLimit: number) {
  const page = filterPage && filterPage > 0 ? filterPage : 1;
  const limit = filterLimit && filterLimit > 0 ? filterLimit : 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
