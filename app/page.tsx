"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <main className="bg-gray-950 text-white">

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          CorePanel
        </h1>

        <h2 className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl">
          Secure Internal Management for Modern Small Businesses
        </h2>

        <p className="text-gray-400 max-w-xl mb-8">
          Replace messy spreadsheets with a clean, secure internal dashboard built for your workflow.
        </p>

        <div className="flex gap-4">
          <a
            href="/login"
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
          >
            View Live Demo
          </a>

          <a
            href="mailto:your@email.com"
            className="px-6 py-3 border border-gray-600 rounded-lg hover:border-white transition"
          >
            Request Custom Setup
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why CorePanel?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Feature 1 */}
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <h4 className="text-xl font-semibold mb-4">
              Secure Authentication
            </h4>
            <p className="text-gray-400">
              Built-in JWT authentication and protected routes ensure your internal data stays safe.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <h4 className="text-xl font-semibold mb-4">
              Custom Workflow
            </h4>
            <p className="text-gray-400">
              Adapt the dashboard to match your team’s workflow — tasks, clients, projects, and more.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <h4 className="text-xl font-semibold mb-4">
              Replace Spreadsheets
            </h4>
            <p className="text-gray-400">
              Move away from messy spreadsheets and manage everything in one clean, organized system.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}

function Feature({ title, description }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:scale-[1.03] transition-all duration-200 shadow-lg">
      <h4 className="text-xl font-semibold mb-4">{title}</h4>
      <p className="text-gray-400">{description}</p>

            {/* WHO IS THIS FOR */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          
          <h3 className="text-3xl font-bold mb-12">
            Who is CorePanel for?
          </h3>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
              <h4 className="text-xl font-semibold mb-4">
                Small Agencies
              </h4>
              <p className="text-gray-400">
                Manage clients, tasks, and internal projects from one secure dashboard.
              </p>
            </div>

            <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
              <h4 className="text-xl font-semibold mb-4">
                Service Businesses
              </h4>
              <p className="text-gray-400">
                Track operations, appointments, and workflows without messy spreadsheets.
              </p>
            </div>

            <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
              <h4 className="text-xl font-semibold mb-4">
                Growing Teams
              </h4>
              <p className="text-gray-400">
                Scale your internal system as your team grows.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>

    
  );
}

function PricingCard({
  title,
  price,
  features,
  highlight,
}: any) {
  return (
    <div
      className={`rounded-2xl p-8 border ${
        highlight
          ? "border-blue-500 scale-105"
          : "border-gray-800"
      } transition-all duration-200 shadow-lg bg-gray-900`}
    >
      <h4 className="text-xl font-bold mb-4">{title}</h4>
      <p className="text-3xl font-bold mb-6">{price}</p>

      <ul className="space-y-2 text-sm text-gray-400">
        {features.map((f: string, i: number) => (
          <li key={i}>✓ {f}</li>
        ))}
      </ul>

      <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded transition">
        Choose Plan
      </button>
    </div>
  );
}
