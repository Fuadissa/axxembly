// In CodeListings.tsx
"use client";

import { CardSkeleton } from "@/components/code-card/card-skeleton";
import { CodeCard } from "@/components/code-card/code-card";
import InfiniteScrollContainer from "@/lib/InfiniteScrollContainer";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React from "react";

export const CodeListings = () => {
  interface PostPage {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    posts: any[];
    nextCursor: string | null;
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<PostPage>({
    queryKey: ["codePost", "for-you"],
    queryFn: ({ pageParam }) =>
      axios
        .get(`/api/code-posts?cursor=${pageParam || ""}`)
        .then((res) => res.data),
    getNextPageParam: (lastPage: PostPage) => lastPage.nextCursor,
    initialPageParam: null,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <CardSkeleton />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">No posts available.</p>
    );
  }

  return (
    <section className="lg:py-10 py-4 overflow-x-clip">
      <div className="container relative lg:pl-0 lg:pr-0">
        <InfiniteScrollContainer
          className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6"
          onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
          {posts.map((post) => (
            <CodeCard post={post} key={post._id} />
          ))}
        </InfiniteScrollContainer>

        {isFetchingNextPage && (
          <div className="flex justify-center items-center">
            <Loader2 className="mx-auto my-3 animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
};
