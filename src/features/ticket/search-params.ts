import {
  createParser,
  createSearchParamsCache,
  parseAsString,
} from 'nuqs/server';
import { parseEnvStringToNumber } from '@/lib/utils';
import { PAGINATION_PARSER_DEFAULT_VALUE } from './constants';

export const createPositiveParser = (limit?: number) => {
  return createParser({
    parse: (v: string): number | null => {
      const int = parseInt(v);

      if (Number.isNaN(int)) {
        return null;
      }

      if (int < 0) {
        return null;
      }

      // Apply limit if provided
      if (limit !== undefined && int > limit) {
        return limit;
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
  size: createPositiveParser(
    parseEnvStringToNumber(process.env.MAX_URL_SIZE_PARSE_LIMIT) ?? undefined
  ).withDefault(PAGINATION_PARSER_DEFAULT_VALUE),
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
