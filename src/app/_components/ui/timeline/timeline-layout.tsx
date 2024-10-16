"use client";

import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
} from "~/app/_components/ui/timeline/timeline";
import type { TimelineElement } from "~/constant/timeline";

interface TimelineLayoutProps {
  timelines: TimelineElement[];
}

export const TimelineBuilder = ({ timelines }: TimelineLayoutProps) => {
  return (
    <Timeline>
      {timelines.map((item) => (
        <TimelineItem key={item.title}>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineTime>{item.date}</TimelineTime>
            <TimelineIcon />
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>{item.description}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
