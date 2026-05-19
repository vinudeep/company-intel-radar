import { NextResponse } from "next/server";

type WikipediaSearchResult = {
    title: string;
    pageid: number;
    snippet?: string;
};

type WikipediaSummary = {
    title?: string;
    extract?: string;
    content_urls?: {
        desktop?: {
            page?: string;
        };
    };
};

function createFallbackProfile(company: string) {
    return {
        name: company,
        description:
            "No reliable public company profile was found from Wikipedia for this search. This may happen if the company name is ambiguous, misspelled, or not available in the selected public source.",
        sourceUrl: null,
        confidence: "Low",
        retrievedAt: new Date().toISOString(),
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

    try {
        const searchUrl =
            "https://en.wikipedia.org/w/api.php?" +
            "action=query" +
            "&list=search" +
            `&srsearch=${encodeURIComponent(cleanCompany + " company")}` +
            "&format=json" +
            "&origin=*" +
            "&srlimit=1";

        const searchResponse = await fetch(searchUrl, {
            cache: "no-store",
            headers: {
                "User-Agent": "company-intel-radar-dev",
                Accept: "application/json",
            },
        });

        if (!searchResponse.ok) {
            return NextResponse.json(createFallbackProfile(cleanCompany));
        }

        const searchData = await searchResponse.json();
        const results = searchData?.query?.search as WikipediaSearchResult[] | undefined;

        if (!results || results.length === 0) {
            return NextResponse.json(createFallbackProfile(cleanCompany));
        }

        const bestMatch = results[0];
        const title = bestMatch.title;

        const summaryUrl =
            "https://en.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(title);

        const summaryResponse = await fetch(summaryUrl, {
            cache: "no-store",
            headers: {
                "User-Agent": "company-intel-radar-dev",
                Accept: "application/json",
            },
        });

        if (!summaryResponse.ok) {
            return NextResponse.json(createFallbackProfile(cleanCompany));
        }

        const summaryData = (await summaryResponse.json()) as WikipediaSummary;

        return NextResponse.json({
            name: summaryData.title || title || cleanCompany,
            description:
                summaryData.extract ||
                "A public profile was found, but no summary description was available.",
            sourceUrl:
                summaryData.content_urls?.desktop?.page ||
                `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
            confidence: "Medium",
            retrievedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Company profile fetch error:", error);
        return NextResponse.json(createFallbackProfile(cleanCompany));
    }
}