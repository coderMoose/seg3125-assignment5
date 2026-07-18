import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts'
import {
  seasons,
  players,
  stats,
  data,
  playerColors,
  SOURCE_URL,
  SOURCE_NAME,
} from './nbaData'
import { LANGUAGES, makeT, formatStat } from './i18n'

// Chart chrome colours, kept in the portfolio's slate palette.
const GRID = '#e2e8f0'
const AXIS = '#cbd5e1'
const TICK = '#64748b'

// ---------------------------------------------------------------------------
// Small shared UI pieces
// ---------------------------------------------------------------------------

// A segmented single-choice control (used for the stat and season pickers).
function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <div className="inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Line chart card — the fully localized chart (axes, legend, tooltip, numbers)
// ---------------------------------------------------------------------------

function LineTooltip({ active, payload, label, lang, t, stat }) {
  if (!active || !payload || payload.length === 0) return null
  const unit = t('statShort')[stat]
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t('seasonAxis')} {label}
      </p>
      <ul className="space-y-1">
        {payload
          .slice()
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
          .map((entry) => (
            <li key={entry.dataKey} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">{entry.name}</span>
              <span className="ml-auto font-semibold tabular-nums text-slate-900">
                {formatStat(entry.value, lang)} {unit}
              </span>
            </li>
          ))}
      </ul>
    </div>
  )
}

function LineChartCard({ lang, t }) {
  const [stat, setStat] = useState('ppg')
  const [visible, setVisible] = useState(() => players.map((p) => p.id))

  const togglePlayer = (id) => {
    setVisible((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    )
  }

  // Reshape into one row per season: { season, lebron: 27.4, curry: 27.3, ... }
  const chartData = useMemo(
    () =>
      seasons.map((season) => {
        const row = { season }
        players.forEach((p) => {
          row[p.id] = data[p.id][season][stat]
        })
        return row
      }),
    [stat],
  )

  const statOptions = stats.map((s) => ({ value: s, label: t('statShort')[s] }))

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {t('lineTitle')}
        </p>
        <h2 className="font-title mt-1 text-xl font-semibold text-slate-900">
          {t('statLong')[stat]}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t('lineContext')}</p>
      </header>

      <div className="mb-6 flex flex-col gap-5">
        <SegmentedControl
          label={t('statPickerLabel')}
          options={statOptions}
          value={stat}
          onChange={setStat}
        />

        {/* Player toggles double as the legend: colour + name, click to show/hide */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            {t('playersLabel')}
          </span>
          <div className="flex flex-wrap gap-2">
            {players.map((p) => {
              const on = visible.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => togglePlayer(p.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    on
                      ? 'border-slate-300 bg-white text-slate-800 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: on ? playerColors[p.id] : '#cbd5e1' }}
                  />
                  {p.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">{t('selectAtLeastOne')}</p>
      ) : (
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis
                dataKey="season"
                tick={{ fill: TICK, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: AXIS }}
                padding={{ left: 12, right: 12 }}
              >
                <Label value={t('seasonAxis')} position="bottom" offset={8} fill={TICK} fontSize={12} />
              </XAxis>
              <YAxis
                tick={{ fill: TICK, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: AXIS }}
                width={44}
                tickFormatter={(value) => formatStat(value, lang)}
              >
                <Label
                  value={t('statShort')[stat]}
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: TICK, fontSize: 12 }}
                />
              </YAxis>
              <Tooltip
                cursor={{ stroke: AXIS, strokeWidth: 1 }}
                content={<LineTooltip lang={lang} t={t} stat={stat} />}
              />
              {players
                .filter((p) => visible.includes(p.id))
                .map((p) => (
                  <Line
                    key={p.id}
                    type="monotone"
                    dataKey={p.id}
                    name={p.name}
                    stroke={playerColors[p.id]}
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 0, fill: playerColors[p.id] }}
                    activeDot={{ r: 5 }}
                    connectNulls
                    isAnimationActive={false}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Bar chart card — horizontal, sorted, localized controls & tooltip
// ---------------------------------------------------------------------------

function BarTooltip({ active, payload, lang, t, stat }) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0].payload
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
      <p className="mt-0.5 text-sm text-slate-600">
        {formatStat(item.value, lang)} {t('statShort')[stat]}
      </p>
    </div>
  )
}

function BarChartCard({ lang, t }) {
  const [season, setSeason] = useState(seasons[seasons.length - 1])
  const [stat, setStat] = useState('ppg')

  // One row per player for the chosen season+stat, sorted high → low so the
  // longest bar sits on top.
  const chartData = useMemo(
    () =>
      players
        .map((p) => ({
          id: p.id,
          name: p.name,
          value: data[p.id][season][stat],
        }))
        .sort((a, b) => b.value - a.value),
    [season, stat],
  )

  const statOptions = stats.map((s) => ({ value: s, label: t('statShort')[s] }))
  const seasonOptions = seasons.map((s) => ({ value: s, label: s }))

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {t('barTitle')}
        </p>
        <h2 className="font-title mt-1 text-xl font-semibold text-slate-900">
          {t('statLong')[stat]} · {season}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t('barContext')}</p>
      </header>

      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-8">
        <SegmentedControl
          label={t('seasonPickerLabel')}
          options={seasonOptions}
          value={season}
          onChange={setSeason}
        />
        <SegmentedControl
          label={t('statPickerLabel')}
          options={statOptions}
          value={stat}
          onChange={setStat}
        />
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 40, bottom: 8, left: 8 }}
          >
            <CartesianGrid stroke={GRID} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: AXIS }}
              tickFormatter={(value) => formatStat(value, lang)}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: TICK, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: AXIS }}
              width={150}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.12)' }}
              content={<BarTooltip lang={lang} t={t} stat={stat} />}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={26} isAnimationActive={false}>
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={playerColors[entry.id]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Dashboard shell
// ---------------------------------------------------------------------------

export default function NbaDashboard() {
  const [lang, setLang] = useState('en')
  const t = useMemo(() => makeT(lang), [lang])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8 sm:px-8 lg:py-12">
        <div>
          <Link
            to="/"
            className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            {t('back')}
          </Link>
        </div>

        <header className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              {t('kicker')}
            </p>
            <h1 className="font-title mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t('title')}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{t('intro')}</p>
          </div>

          {/* Language selector — each language shown in its own name */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              {t('languageLabel')}
            </span>
            <div className="inline-flex gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
              {LANGUAGES.map((language) => {
                const active = language.code === lang
                return (
                  <button
                    key={language.code}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLang(language.code)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {language.label}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        <LineChartCard lang={lang} t={t} />
        <BarChartCard lang={lang} t={t} />

        <footer className="border-t border-slate-200 pt-6 text-sm text-slate-500">
          {t('sourceNote')}{' '}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            {SOURCE_NAME}
          </a>
          .
        </footer>
      </main>
    </div>
  )
}
