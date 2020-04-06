// maps results out of listTopics to a config object containing prefixed topics
export function getPrefixedTopicsConfig({
    topics,
    prefix
}: {
    topics: { TopicName: string }[];
    prefix: string;
}) {
    return topics
        .filter((topic: any) => topic.TopicName.startsWith(prefix))
        .map((topic: any) => ({ topic: topic.TopicName }));
}
