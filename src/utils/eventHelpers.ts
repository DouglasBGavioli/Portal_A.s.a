type EventWithDate = {
  date: string;
};

export function parseEventDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

export function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function isUpcomingEvent(event: EventWithDate) {
  return parseEventDate(event.date) >= getToday();
}

export function isPastEvent(event: EventWithDate) {
  return parseEventDate(event.date) < getToday();
}

export function getUpcomingEvents<T extends EventWithDate>(events: T[]) {
  return events
    .filter((event) => isUpcomingEvent(event))
    .sort(
      (a, b) =>
        parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime(),
    );
}

export function getPastEvents<T extends EventWithDate>(events: T[]) {
  return events
    .filter((event) => isPastEvent(event))
    .sort(
      (a, b) =>
        parseEventDate(b.date).getTime() - parseEventDate(a.date).getTime(),
    );
}

export function getNextEvent<T extends EventWithDate>(events: T[]) {
  const upcoming = getUpcomingEvents(events);
  return upcoming.length > 0 ? upcoming[0] : null;
}
