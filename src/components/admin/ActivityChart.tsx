"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale } from "@/components/providers/LocaleProvider";
import { activitySeries } from "@/lib/data";

export function ActivityChart() {
  const { t, pick } = useLocale();

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={activitySeries} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="members" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#064e3b" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#064e3b" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="events" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#d4af37" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" strokeOpacity={0.08} vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "#4b5f57" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#4b5f57" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 12px 32px -16px rgba(6,78,59,0.4)",
              fontSize: 12,
              color: "#064e3b",
            }}
            labelStyle={{ fontWeight: 600, color: "#064e3b" }}
          />
          <Area
            type="monotone"
            dataKey="members"
            name={pick("New members", "أعضاء جدد")}
            stroke="#064e3b"
            strokeWidth={2}
            fill="url(#members)"
          />
          <Area
            type="monotone"
            dataKey="events"
            name={pick("Events", "فعاليات")}
            stroke="#d4af37"
            strokeWidth={2}
            fill="url(#events)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-sanad-emerald-900/50 dark:text-sanad-beige-100/50">
        {t("admin.activityDesc")}
      </p>
    </div>
  );
}
