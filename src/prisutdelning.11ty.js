// Kalenderfil för nästa prisutdelning. Skapas bara när ett datum finns i
// src/_data/prisutdelning.yml.

export function data() {
  return {
    eleventyExcludeFromCollections: true,
    permalink: (d) => (d.prisutdelning?.datum ? "/prisutdelning.ics" : false),
  };
}

// Svensk tid, så att kalendern visar rätt klockslag även vid sommartid
const STOCKHOLM = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Stockholm",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const pad = (n) => String(n).padStart(2, "0");

export function render({ prisutdelning: p, site }) {
  const d = new Date(p.datum);
  const [h, m] = this.klockslag(p.tid);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m));
  const slut = new Date(start.getTime() + (Number(p.timmar) || 1) * 3600e3);
  const lokal = (t) =>
    `${t.getUTCFullYear()}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}T${pad(t.getUTCHours())}${pad(t.getUTCMinutes())}00`;
  const nu = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kulturpriset Nyponet//SV",
    "CALSCALE:GREGORIAN",
    ...STOCKHOLM,
    "BEGIN:VEVENT",
    `UID:prisutdelning-${lokal(start)}@nyponet`,
    `DTSTAMP:${nu}`,
    `DTSTART;TZID=Europe/Stockholm:${lokal(start)}`,
    `DTEND;TZID=Europe/Stockholm:${lokal(slut)}`,
    `SUMMARY:${esc(site.namn)}`,
    p.plats ? `LOCATION:${esc(p.plats)}` : null,
    p.text ? `DESCRIPTION:${esc(p.text)}` : null,
    `URL:${site.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n") + "\r\n";
}
