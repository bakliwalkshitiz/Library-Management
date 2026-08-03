import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard title="Books" value="250" />

      <StatCard title="Users" value="48" />

      <StatCard title="Borrowed" value="29" />

      <StatCard title="Authors" value="87" />

    </div>
  );
}