import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ScissorsIcon,
  SparklesIcon,
  CheckCircleIcon,
  StarIcon,
  CalendarDaysIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const services = [
  {
    icon: SparklesIcon,
    name: 'Basic Bath',
    price: '$25',
    duration: '30 min',
    description: 'Gentle rinse and dry. Recommended once a month.',
  },
  {
    icon: StarIcon,
    name: 'Full Grooming',
    price: '$55',
    duration: '60 min',
    description: 'Complete wash, feather detangle, nail trim, and blow-dry.',
  },
  {
    icon: ScissorsIcon,
    name: 'Feather Trim',
    price: '$35',
    duration: '45 min',
    description: 'Shape and tidy overgrown flight feathers by our specialists.',
  },
  {
    icon: CheckCircleIcon,
    name: 'Beak Polish',
    price: '$20',
    duration: '20 min',
    description: 'Light filing and conditioning to keep beaks smooth and healthy.',
  },
]

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

const defaultForm = {
  name: '',
  email: '',
  birdType: '',
  service: '',
  date: '',
  time: '',
  notes: '',
}

export default function CleanBeaks() {
  const [form, setForm] = useState(defaultForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.birdType) next.birdType = 'Select a bird type.'
    if (!form.service) next.service = 'Select a service.'
    if (!form.date) next.date = 'Choose a date.'
    if (!form.time) next.time = 'Choose a time slot.'
    return next
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    setSubmitted(true)
  }

  const handleReset = () => {
    setForm(defaultForm)
    setErrors({})
    setSubmitted(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-sky-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Clean Beaks logo" className="h-14 w-14 rounded-full object-cover" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-sky-700">Clean Beaks</h1>
              <p className="text-xs text-slate-500">Goose &amp; Duck Grooming</p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#services" className="text-slate-600 transition hover:text-sky-700">Services</a>
            <a
              href="#book"
              className="rounded-full bg-sky-600 px-4 py-2 text-white transition hover:bg-sky-700"
            >
              Book Now
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative px-6 py-20 text-center text-white"
        style={{ backgroundImage: 'url(/geese-hero-image.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/85 to-sky-800/85" />
        <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
          <ScissorsIcon className="h-10 w-10 text-white" />
        </div>
        <h2 className="relative z-10 mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Every bird deserves a spa day
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-lg text-sky-100">
          Professional grooming for geese and ducks
        </p>
        <a
          href="#book"
          className="relative z-10 mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-sky-700 shadow transition hover:bg-sky-50"
        >
          Book an Appointment
        </a>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-800">Our Services</h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          All services are performed by our certified bird experts.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.name}
              className="flex flex-col rounded-2xl border border-sky-100 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
            >
              <s.icon className="h-7 w-7 text-sky-500" />
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{s.name}</h3>
                <span className="text-lg font-bold text-sky-600">{s.price}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                <ClockIcon className="h-3.5 w-3.5" />
                {s.duration}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex flex-col items-center gap-2">
            <CalendarDaysIcon className="h-8 w-8 text-sky-500" />
            <h2 className="text-center text-2xl font-bold text-slate-800">Book an Appointment</h2>
            <p className="text-center text-sm text-slate-500">
              Fill in the form below and we'll confirm your booking via email.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold text-green-800">Booking Confirmed!</h3>
              <p className="mt-2 text-sm text-green-700">
                Thanks, <strong>{form.name}</strong>! We'll send a confirmation to <strong>{form.email}</strong> shortly.
              </p>
              <p className="mt-1 text-sm text-green-700">
                <strong>{form.service}</strong> on <strong>{form.date}</strong> at <strong>{form.time}</strong>.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 rounded-full bg-sky-600 px-6 py-2 text-sm text-white transition hover:bg-sky-700"
              >
                Book Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className={`rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-400 ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-sky-400'}`}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className={`rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-400 ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-sky-400'}`}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700" htmlFor="birdType">Bird Type</label>
                  <select
                    id="birdType"
                    name="birdType"
                    value={form.birdType}
                    onChange={handleChange}
                    className={`rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-400 ${errors.birdType ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-sky-400'}`}
                  >
                    <option value="">Select bird type</option>
                    <option>Goose</option>
                    <option>Duck</option>
                    <option>Other bird</option>
                  </select>
                  {errors.birdType && <p className="text-xs text-red-500">{errors.birdType}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700" htmlFor="service">Service</label>
                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={`rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-400 ${errors.service ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-sky-400'}`}
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s.name}>{s.name} — {s.price}</option>
                    ))}
                  </select>
                  {errors.service && <p className="text-xs text-red-500">{errors.service}</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700" htmlFor="date">Preferred Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={handleChange}
                    className={`rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-400 ${errors.date ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-sky-400'}`}
                  />
                  {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700" htmlFor="time">Time Slot</label>
                  <select
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={`rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-sky-400 ${errors.time ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-sky-400'}`}
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="notes">
                  Additional Notes <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any special needs or concerns about your bird…"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <button
                type="submit"
                className="mt-2 self-center rounded-full bg-sky-600 px-10 py-3 font-semibold text-white shadow transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                Confirm Appointment
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sky-100 bg-sky-50 px-6 py-8 text-center text-sm text-slate-500">
        <img src="/logo.png" alt="Clean Beaks logo" className="mx-auto h-14 w-14 rounded-full object-cover" />
        <p className="mt-2 font-semibold text-sky-700">Clean Beaks</p>
        <p className="mt-2">
          123 Duck Street, Gooseville, Canada <br />
          Designed by{' '}
          <Link to="/" className="font-medium text-sky-600 underline underline-offset-2 hover:text-sky-800">
            Daniel
          </Link>
        </p>
      </footer>
    </div>
  )
}
