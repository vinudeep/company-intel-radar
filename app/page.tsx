"use client";

import { useState } from "react";

type NewsItem = {
    title: string;
    source: string;
    url: string;
    publishedAt: string | null;
    language: string | null;
    sourceCountry: string | null;
};

type NewsApiResponse = {
    company: string;
    dateRange: string;
    source: string;
    retrievedAt: string;
    warning?: string;
    count: number;
    news: NewsItem[];
};

type CompanyProfile = {
    name: string;
    description: string;
    sourceUrl: string | null;
    confidence: string;
    retrievedAt: string;
};

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 font-medium text-slate-100">{value}</p>
        </div>
    );
}

function formatDate(value: string | null) {
    if (!value) {
        return "Date unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

export default function Home() {
    const [companyName, setCompanyName] = useState("SAP");
    const [searchedCompany, setSearchedCompany] = useState("SAP");
    const [newsData, setNewsData] = useState<NewsApiResponse | null>(null);
    const [profileData, setProfileData] = useState<CompanyProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSearch() {
        const cleanCompany = companyName.trim();

        if (!cleanCompany) {
            setErrorMessage("Please enter a company name.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setNewsData(null);
        setProfileData(null);

        try {
            const [newsResponse, profileResponse] = await Promise.all([
                fetch(`/api/news?company=${encodeURIComponent(cleanCompany)}`),
                fetch(`/api/company-profile?company=${encodeURIComponent(cleanCompany)}`),
            ]);

            if (!newsResponse.ok) {
                throw new Error("News API request failed.");
            }

            if (!profileResponse.ok) {
                throw new Error("Company profile API request failed.");
            }

            const news = (await newsResponse.json()) as NewsApiResponse;
            const profile = (await profileResponse.json()) as CompanyProfile;

            setSearchedCompany(cleanCompany);
            setNewsData(news);
            setProfileData(profile);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unexpected error while loading company intelligence."
            );
        } finally {
            setIsLoading(false);
        }
    }

    const confidence = profileData?.confidence || "Low";

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
                    <p className="mt-2 text-lg font-medium text-cyan-300">
                        Created by Vinudeep
                    </p>
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
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Example: SAP, Google, NVIDIA, Microsoft"
                            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-500 placeholder:text-slate-500 focus:ring-2"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {errorMessage ? (
                        <p className="mt-3 rounded-xl border border-red-900 bg-red-950/50 p-3 text-sm text-red-200">
                            {errorMessage}
                        </p>
                    ) : null}
                </div>

                <div className="grid gap-6">
                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row">
                            <div>
                                <h2 className="text-2xl font-bold">Company Snapshot</h2>
                                <p className="text-sm text-slate-400">
                                    Uses a public Wikipedia profile lookup where available.
                                </p>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                Confidence: {confidence}
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Info label="Searched Company" value={searchedCompany} />
                            <Info
                                label="Matched Company"
                                value={profileData?.name || searchedCompany}
                            />
                            <Info label="Ticker" value="To be added" />
                            <Info label="Exchange" value="To be added" />
                            <Info label="Sector" value="To be added" />
                            <Info label="Headquarters" value="To be added" />
                        </div>

                        <p className="mt-5 text-slate-300">
                            {profileData
                                ? profileData.description
                                : `Company profile data for ${searchedCompany} will be loaded from a public company profile API.`}
                        </p>

                        {profileData?.sourceUrl ? (
                            <a
                                href={profileData.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
                            >
                                Open company profile source
                            </a>
                        ) : null}
                    </section>

                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold">Recent News</h2>
                            <p className="text-sm text-slate-400">
                                Live API route connected. Uses GDELT when available and local
                                fallback when blocked.
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-slate-300">
                                Loading company intelligence...
                            </div>
                        ) : newsData ? (
                            <>
                                <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                                    <p>
                                        <span className="font-semibold text-slate-100">
                                            Source:
                                        </span>{" "}
                                        {newsData.source}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-100">
                                            Retrieved:
                                        </span>{" "}
                                        {formatDate(newsData.retrievedAt)}
                                    </p>
                                    {newsData.warning ? (
                                        <p className="mt-3 rounded-lg border border-amber-700 bg-amber-950/40 p-3 text-amber-200">
                                            {newsData.warning}
                                        </p>
                                    ) : null}
                                </div>

                                {newsData.news.length === 0 ? (
                                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-slate-300">
                                        No recent public news found in the last 3 days.
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {newsData.news.map((item) => (
                                            <article
                                                key={`${item.title}-${item.url}`}
                                                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                                            >
                                                <h3 className="font-semibold text-slate-100">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-2 text-sm text-slate-400">
                                                    {item.source} - {formatDate(item.publishedAt)}
                                                </p>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-3 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
                                                >
                                                    Open source
                                                </a>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-slate-300">
                                Search for a company to load recent news and profile data.
                            </div>
                        )}
                    </section>

                    <section className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                            <h2 className="text-2xl font-bold">Sources</h2>
                            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
                                <li>Company snapshot uses /api/company-profile</li>
                                <li>Wikipedia is used as the first public profile source</li>
                                <li>Recent news comes from /api/news</li>
                                <li>GDELT is used when network access allows it</li>
                                <li>Fallback data is used when live API access is blocked</li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                            <h2 className="text-2xl font-bold">
                                Data Confidence and Limitations
                            </h2>
                            <p className="mt-4 text-sm text-slate-300">
                                This MVP uses free public sources. Wikipedia is useful for
                                basic profile descriptions but may not always match the exact
                                legal entity or ticker. Future versions should add financial
                                APIs, ticker resolution, competitor mapping, and source
                                confidence scoring.
                            </p>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}