import {
  createParser,
  createSearchParamsCache,
  parseAsString,
} from 'nuqs/server';
import { PAGINATION_PARSER_DEFAULT_VALUE } from './constants';

export const createPositiveParser = () => {
  return createParser({
    parse: (v: string): number | null => {
      const int = parseInt(v);

      if (Number.isNaN(int) || int < 0) {
        return null;
      }

      return int;
    },

    serialize: (v: number): string => {
      const rounded = Math.round(v);
      return rounded.toFixed();
    },
  });
};

export const searchParser = parseAsString.withDefault('').withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const sortParser = {
  sortKey: parseAsString.withDefault('createdAt'),
  sortValue: parseAsString.withDefault('desc'),
};

export const sortOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const paginationParser = {
  page: createPositiveParser().withDefault(0),
  size: createPositiveParser().withDefault(PAGINATION_PARSER_DEFAULT_VALUE),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const searchParamsCache = createSearchParamsCache({
  search: searchParser,
  ...sortParser,
  ...paginationParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
