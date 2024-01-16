import Link from "next/link";

async function getData(keyword: string) {
    const res = await fetch(`${process.env.API_URL}/keyword?slug=${keyword}`);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export async function generateStaticParams() {
    const keywords = await fetch(`${process.env.API_URL}/keywords/`).then((res) => res.json());
    // console.log(keywords);
    // @ts-ignore
    return keywords.map((item) => ({
        slug: item.slug,
    }));
}

export default async function Page({params}: { params: { slug: string } }) {
    const data = await getData(params.slug);
    console.log(data);

    const puzzles = data.puzzles.map(
        // @ts-ignore
        item => <p key={item.slug}><Link href={`/puzzle/${item.slug}`}>{item.name}</Link></p>
    );

    const categories = data.categories.map(
        // @ts-ignore
        item => <p key={item.slug}><Link href={`/category/${item.slug}`}>{item.name}</Link></p>
    );

    return <main>
        <h1><Link href={"/"}>中国谜题索引</Link>：主题词详情</h1>
        <br/>
        <h2>{data.name}</h2>
        <br/>
        <p>{data.profile}</p>
        <br/>
        <h3>谜题</h3>
        <br/>
        <div>
            {puzzles}
        </div>
        <br/>
        <h3>类目</h3>
        <br/>
        <div>
            {categories}
        </div>

    </main>;
}