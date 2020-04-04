import * as fp from "lodash/fp";

export const toCommaSeparated = fp.reduce(
    (acc: string, sub: { SubscriptionName: string }) =>
        `${sub.SubscriptionName}${acc ? `, ${acc}` : ""}`,
    ""
);
