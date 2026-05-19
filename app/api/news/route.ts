import { NextResponse } from "next/server";

type GdeltArticle = {
    title?: string;
    url?: string;
    sourceCountry?: string;
    domain?: string;
    seendate?: string;
    socialimage?: string;
    language?: string;
};

function getDateDaysAgo(daysAgo: number) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}${month}${day}000000`;
}

function createFallbackNews(company: string) {
    return {
        company,
        dateRange: "Last 3 days",
        source: "Local fallback because GDELT fetch failed",
        retrievedAt: new Date().toISOString(),
        warning:
            "Live GDELT fetch failed. This may be caused by VPN, proxy, firewall, or network restrictions.",
        count: 2,
        news: [
            {
                title: `${company} recent news unavailable from live API`,
                source: "Local fallback",
                url: "https://api.gdeltproject.org",
                publishedAt: new Date().toISOString(),
                language: "English",
                sourceCountry: null,
            },
            {
                title: "API failure handled safely by the application",
                source: "Local fallback",
                url: "https://api.gdeltproject.org",
                publishedAt: new Date().toISOString(),
                language: "English",
                sourceCountry: null,
            },
        ],
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get("company");

    if (!company || !company.trim()) {
        return NextResponse.json(
            { error: "Company name is required" },
            { status: 400 }
        );
    }

    const cleanCompany = company.trim();
    const startDate = getDateDaysAgo(3);
    const query = encodeURIComponent(`"${cleanCompany}"`);

    const gdeltUrl =
        "https://api.gdeltproject.org/api/v2/doc/doc?" +
        `query=${query}` +
        "&mode=artlist" +
        "&format=json" +
        "&maxrecords=10" +
        "&sort=datedesc" +
        `&startdatetime=${startDate}`;

    try {
        const response = await fetch(gdeltUrl, {
            cache: "no-store",
            headers: {
                "User-Agent": "company-intel-radar-dev",
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            return NextResponse.json(createFallbackNews(cleanCompany));
        }

        const data = await response.json();
        const articles = Array.isArray(data.articles) ? data.articles : [];

        const seenUrls = new Set<string>();

        const news = articles
            .filter((article: GdeltArticle) => article.url && article.title)
            .filter((article: GdeltArticle) => {
                if (!article.url) return false;
                if (seenUrls.has(article.url)) return false;
                seenUrls.add(article.url);
                return true;
            })
            .map((article: GdeltArticle) => ({
                title: article.title || "Untitled article",
                source: article.domain || "Unknown source",
                url: article.url || "",
                publishedAt: article.seendate || null,
                language: article.language || null,
                sourceCountry: article.sourceCountry || null,
            }));

        return NextResponse.json({
            company: cleanCompany,
            dateRange: "Last 3 days",
            source: "GDELT",
            retrievedAt: new Date().toISOString(),
            gdeltUrl,
            count: news.length,
            news,
        });
    } catch (error) {
        console.error("GDELT fetch error:", error);
        return NextResponse.json(createFallbackNews(cleanCompany));
    }
}