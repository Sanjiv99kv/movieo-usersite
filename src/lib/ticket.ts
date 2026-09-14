/** Client-side ticket artefacts: a downloadable SVG stub and a calendar invite. */

export type TicketDetails = {
  bookingId: string;
  movieTitle: string;
  cinemaName: string;
  cinemaLocation: string;
  dateLabel: string;
  time: string;
  format: string;
  seats: string[];
  total: string;
};

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (char) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] ?? char,
  );
}

export function downloadTicket(details: TicketDetails, qrDataUrl: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="340" viewBox="0 0 720 340">
  <rect width="720" height="340" rx="18" fill="#12121a"/>
  <rect x="1" y="1" width="718" height="338" rx="17" fill="none" stroke="#2f2f3d"/>
  <text x="40" y="58" fill="#e8483c" font-family="Helvetica,Arial,sans-serif" font-size="13" font-weight="bold" letter-spacing="3">MOVIEO E-TICKET</text>
  <text x="40" y="106" fill="#f6f4f1" font-family="Helvetica,Arial,sans-serif" font-size="30" font-weight="bold">${escapeXml(details.movieTitle)}</text>
  <text x="40" y="140" fill="#9d9dab" font-family="Helvetica,Arial,sans-serif" font-size="15">${escapeXml(details.cinemaName)} · ${escapeXml(details.cinemaLocation)}</text>
  <line x1="40" y1="168" x2="470" y2="168" stroke="#2f2f3d"/>
  <text x="40" y="200" fill="#9d9dab" font-family="Helvetica,Arial,sans-serif" font-size="12">DATE</text>
  <text x="40" y="222" fill="#f6f4f1" font-family="Helvetica,Arial,sans-serif" font-size="16" font-weight="bold">${escapeXml(details.dateLabel)}</text>
  <text x="210" y="200" fill="#9d9dab" font-family="Helvetica,Arial,sans-serif" font-size="12">TIME</text>
  <text x="210" y="222" fill="#f6f4f1" font-family="Helvetica,Arial,sans-serif" font-size="16" font-weight="bold">${escapeXml(details.time)}</text>
  <text x="340" y="200" fill="#9d9dab" font-family="Helvetica,Arial,sans-serif" font-size="12">FORMAT</text>
  <text x="340" y="222" fill="#f6f4f1" font-family="Helvetica,Arial,sans-serif" font-size="16" font-weight="bold">${escapeXml(details.format)}</text>
  <text x="40" y="262" fill="#9d9dab" font-family="Helvetica,Arial,sans-serif" font-size="12">SEATS</text>
  <text x="40" y="284" fill="#f6f4f1" font-family="Helvetica,Arial,sans-serif" font-size="16" font-weight="bold">${escapeXml(details.seats.join(", "))}</text>
  <text x="210" y="262" fill="#9d9dab" font-family="Helvetica,Arial,sans-serif" font-size="12">TOTAL PAID</text>
  <text x="210" y="284" fill="#f6f4f1" font-family="Helvetica,Arial,sans-serif" font-size="16" font-weight="bold">${escapeXml(details.total)}</text>
  <line x1="500" y1="24" x2="500" y2="316" stroke="#2f2f3d" stroke-dasharray="6 8"/>
  <image href="${qrDataUrl}" x="540" y="70" width="150" height="150"/>
  <text x="615" y="248" fill="#9d9dab" font-family="Helvetica,Arial,sans-serif" font-size="12" text-anchor="middle">BOOKING ID</text>
  <text x="615" y="272" fill="#f6f4f1" font-family="Helvetica,Arial,sans-serif" font-size="16" font-weight="bold" text-anchor="middle">${escapeXml(details.bookingId)}</text>
</svg>`;

  download(new Blob([svg], { type: "image/svg+xml" }), `movieo-${details.bookingId}.svg`);
}

function toICSDate(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function downloadCalendarInvite(
  details: TicketDetails,
  start: Date,
  durationMinutes: number,
) {
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MOVIEO//EN",
    "BEGIN:VEVENT",
    `UID:${details.bookingId}@movieo`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${details.movieTitle} (${details.format})`,
    `LOCATION:${details.cinemaName}\\, ${details.cinemaLocation}`,
    `DESCRIPTION:Seats ${details.seats.join(" ")} · Booking ${details.bookingId}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  download(
    new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }),
    `movieo-${details.bookingId}.ics`,
  );
}
