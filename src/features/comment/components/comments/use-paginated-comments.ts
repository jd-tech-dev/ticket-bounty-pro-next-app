import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { PaginatedData } from '@/types/pagination';
import { getComments } from '../../queries/get-comments';
import { CommentWithMetadata } from '../../types';

export const usePaginatedComments = (
  ticketId: string,
  paginatedComments: PaginatedData<CommentWithMetadata>
) => {
  const queryKey = ['comments', ticketId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam: undefined as
        | { id: string; createdAt: number }
        | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: paginatedComments.list,
            metadata: paginatedComments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const comments = data.pages.flatMap((page) => page.list);

  const queryClient = useQueryClient();

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onDeleteComment: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onCreateComment: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onCreateAttachment: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onDeleteAttachment: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
};
