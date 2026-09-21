export default function ArtisticDivider() {
  return (
    <div className="flex items-center gap-2 my-2 opacity-60 select-none" aria-hidden="true">
      <div className="h-1 w-12 rounded-full bg-terracota" />
      <div className="h-1.5 w-6 rounded-full bg-ambar" />
      <div className="h-1 w-3 rounded-full bg-oliva" />
      <div className="h-0.5 flex-1 bg-gradient-to-r from-terracota/40 via-areia to-transparent rounded-full" />
    </div>
  );
}
