"use client";
export function MapEmbed({
  bbox = "106.70%2C-6.35%2C106.90%2C-6.05",
  marker = "-6.2%2C106.82",
  height = 520,
}: {
  bbox?: string;   // encodeURIComponent bbox
  marker?: string; // encodeURIComponent lat,long
  height?: number;
}) {
  return (
    <div className="rounded-xl overflow-hidden border">
      <iframe
        className="w-full"
        style={{ height }}
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
      />
    </div>
  );
}
