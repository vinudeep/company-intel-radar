"use client";

import { useState } from "react";

const mockCompany = {
    name: "SAP SE",
    ticker: "SAP",
    exchange: "XETRA / NYSE",
    sector: "Enterprise Software",
    headquarters: "Walldorf, Germany",
    website: "https://www.sap.com",
    description:
        "SAP is a global enterprise software company known for ERP, cloud business applications, analytics, procurement, HR, and supply chain solutions.",
};

const mockNews = [
    {
        title: "SAP expands AI capabilities across enterprise applications",
        source: "Mock Source",
        date: "Recent",
        url: "https://www.sap.com",
        summary:
            "SAP continues to integrate AI capabilities into its enterprise software portfolio, focusing on business productivity and automation.",
    },
    {
        title: "SAP cloud business remains a strategic growth area",
        source: "Mock Source",
        date: "Recent",
        url: "https://www.sap.com",
        summary:
            "Cloud ERP, business technology platform, and industry-specific cloud solutions remain key areas in SAP's growth strategy.",
    },
];

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 font-medium text-slate-100">{value}</p>
        </div>
    );
}

export default function Home() {
    const [companyName, setCompanyName] = useState("SAP");
    const [searchedCompany, setSearchedCompany] = useState("SAP");
    const [isLoading, setIsLoading] = useState(false);

    function handleSearch() {
        if (!companyName.trim()) {
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setSearchedCompany(companyName.trim());
            setIsLoading(false);
        }, 700);
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="mb-10">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-400">
                        Portfolio MVP
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                        Company Intel Radar
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        A source-backed company intelligence dashboard for recent news,
                        company snapshots, competitor context, financial signals, and
                        executive-style briefings.
                    </p>
                </div>

                <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Enter company name
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            value={companyName}
                            onChange={(event) => setCompanyName(event.target.value)}
                            placeholder="Example: SAP, NVIDIA, Microsoft"
                            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-500 placeholder:text-slate-500 focus:ring-2"
                        />
                        <button
                            onClick={handleSearch}
                            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-300">
                        Loading company intelligence...
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row">
                                <div>
                                    <h2 className="text-2xl font-bold">Company Snapshot</h2>
                                    <p className="text-sm text-slate-400">
                                        Mock data for now. Later this will come from public APIs.
                                    </p>
                                </div>
                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                    Confidence: Medium
                                </span>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Info label="Searched Company" value={searchedCompany} />
                                <Info label="Matched Company" value={mockCompany.name} />
                                <Info label="Ticker" value={mockCompany.ticker} />
                                <Info label="Exchange" value={mockCompany.exchange} />
                                <Info label="Sector" value={mockCompany.sector} />
                                <Info label="Headquarters" value={mockCompany.headquarters} />
                            </div>

                            <p className="mt-5 text-slate-300">{mockCompany.description}</p>

                            <a
                                href={mockCompany.website}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
                            >
                                Visit company website
                            </a>
                        </section>

                        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold">Recent News</h2>
                                <p className="text-sm text-slate-400">
                                    Mock news. Next step: connect to GDELT for last 3 days.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {mockNews.map((item) => (
                                    <article
                                        key={item.title}
                                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                                    >
                                        <h3 className="font-semibold text-slate-100">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-400">
                                            {item.source} - {item.date}
                                        </p>
                                        <p className="mt-3 text-sm text-slate-300">
                                            {item.summary}
                                        </p>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
                                        >
                                            Source
                                        </a>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                                <h2 className="text-2xl font-bold">Sources</h2>
                                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
                                    <li>Mock SAP website source</li>
                                    <li>Mock recent news source</li>
                                    <li>Real API integration will be added next</li>
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                                <h2 className="text-2xl font-bold">
                                    Data Confidence and Limitations
                                </h2>
                                <p className="mt-4 text-sm text-slate-300">
                                    This MVP currently uses mock data. The next version will add
                                    live news from GDELT, caching, public company profiles, and
                                    financial data. Missing or uncertain data should be shown
                                    honestly instead of guessed.
                                </p>
                            </div>
                        </section>
                    </div>
                )}
            </section>
        </main>
    );
}