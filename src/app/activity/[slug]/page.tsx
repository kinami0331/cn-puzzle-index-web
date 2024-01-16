import Link from "next/link";

async function getData(keyword: string) {
    const res = await fetch(`${process.env.API_URL}/activity?slug=${keyword}`);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export async function generateStaticParams() {
    const data = await fetch(`${process.env.API_URL}/activities/`).then((res) => res.json());
    // @ts-ignore
    return data.map((item) => ({
        slug: item.slug,
    }));
}

export default async function Page({params}: { params: { slug: string } }) {
    const data = await getData(params.slug);
    console.log(data);

    const authors = data.authors.map(
        // @ts-ignore
        item => <p key={item.slug}><Link href={`/author/${item.slug}`}>{item.name}&nbsp;</Link></p>
    );

    const puzzles = data.puzzles.map(
        // @ts-ignore
        item => <p key={item.slug}><Link href={`/puzzle/${item.slug}`}>{item.name}&nbsp;</Link></p>
    );

    return <main>
        <h1><Link href={"/"}>中国谜题索引</Link>：主题词详情</h1>
        <br/>
        <h2>{data.name}</h2>
        <br/>
        <h3>谜题</h3>
        <br/>
        <div>
            {puzzles}
        </div>
        <h3>作者</h3>
        <br/>
        <div>
            {authors}
        </div>

    </main>;
}