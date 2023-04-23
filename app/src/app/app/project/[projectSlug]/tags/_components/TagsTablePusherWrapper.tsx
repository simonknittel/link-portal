"use client";

import { type Tag } from "@prisma/client";
import PusherJS from "pusher-js";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";
import TagsTable, { type TagsTableProps } from "./TagsTable";

interface Props {
  tags: TagsTableProps["tags"];
}

const TagsTablePusherWrapper = ({ tags }: Props) => {
  const [_tags, setTags] = useState(tags);

  useEffect(() => {
    setTags(tags);
  }, [tags]);

  useEffect(() => {
    if (
      !env.NEXT_PUBLIC_PUSHER_HOST ||
      !env.NEXT_PUBLIC_PUSHER_PORT ||
      !env.NEXT_PUBLIC_PUSHER_APP_KEY
    )
      return;

    const client = new PusherJS(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      wsHost: env.NEXT_PUBLIC_PUSHER_HOST,
      wsPort: parseInt(env.NEXT_PUBLIC_PUSHER_PORT),
      disableStats: true,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
    });

    client.subscribe("my-project").bind("tag-created", (data: Tag) => {
      setTags((tags) => [...tags, data]);
    });

    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <TagsTable tags={_tags.sort((a, b) => a.title.localeCompare(b.title))} />
  );
};

export default TagsTablePusherWrapper;
