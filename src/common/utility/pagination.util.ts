export function paginationSolver(page: number = 1, limit: number = 10) {
  if (!page || page <= 1) {
    page = 0;
  } else {
    page = page - 1;
  }

  if (!limit || limit <= 0) limit = 10;
  const skip = page * limit;
  return {
    page,
    limit,
    skip,
  };
}

export function paginationGenerator(
  count: number = 0,
  page: number = 0,
  limit: number = 0
) {
  return {
    totalCount: count,
    page: page + 1,
    countPerPage: limit,
    pageCount: Math.ceil(count / limit),
  };
}
