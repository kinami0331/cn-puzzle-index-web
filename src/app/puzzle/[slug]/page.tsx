import Link from "next/link";

async function getData(keyword: string) {
    const res = await fetch(`${process.env.API_URL}/puzzle?slug=${keyword}`);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export async function generateStaticParams() {
    const puzzles = await fetch(`${process.env.API_URL}/puzzles/`).then((res) => res.json());
    // @ts-ignore
    return puzzles.map((item) => ({
        slug: item.slug,
    }));
}

export default async function Puzzle({params}: { params: { slug: string } }) {
    const data = await getData(params.slug);
    console.log(data);

    const authors = data.authors.map(
        // @ts-ignore
        item => <Link href={`/author/${item.slug}`} key={item.slug}>{item.name}&nbsp;</Link>
    );

    const keywords = data.keywords.map(
        // @ts-ignore
        item => <p key={item.slug}><Link href={`/keyword/${item.slug}`}>{item.name}&nbsp;</Link></p>
    );

    return <main>
        <h1><Link href={"/"}>中国谜题索引</Link>：主题词详情</h1>
        <br/>
        <h2>{data.name}</h2>
        <br/>
        <p>解谜活动：<Link href={`/activity/${data.activity.slug}`}>{data.activity.name}</Link></p>
        <p>轮次/题号：{data.round_or_number}</p>
        <p>作者：{authors}</p>
        <p>解谜活动：<Link href={data.puzzle_page} target={"_blank"} rel={"noreferrer noopener"}>查看谜题</Link></p>
        <p>解谜活动：<Link href={data.solution_page} target={"_blank"} rel={"noreferrer noopener"}>查看解析</Link></p>
        <br/>
        <h3>主题词</h3>
        <br/>
        <div>
            {keywords}
        </div>

    </main>;
}