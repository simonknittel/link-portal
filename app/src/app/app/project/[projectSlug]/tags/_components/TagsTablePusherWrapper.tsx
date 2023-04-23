"use client";

import { type Project, type Tag } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRealtime } from "~/app/app/_utils/useRealtime";
import TagsTable, { type TagsTableProps } from "./TagsTable";

interface Props {
  tags: TagsTableProps["tags"];
  projectId: Project["id"];
}

const TagsTablePusherWrapper = ({ tags, projectId }: Props) => {
  const [_tags, setTags] = useState(tags);
  const client = useRealtime();

  useEffect(() => {
    setTags(tags);
  }, [tags]);

  useEffect(() => {
    const _client = client.current;

    if (!_client) return;

    _client.subscribe(projectId).bind("tag-created", (data: Tag) => {
      setTags((tags) => [...tags, data]);
    });

    return () => {
      if (!_client) return;
      _client.unsubscribe(projectId);
    };
  }, [client, projectId]);

  return (
    <TagsTable tags={_tags.sort((a, b) => a.title.localeCompare(b.title))} />
  );
};

export default TagsTablePusherWrapper;
