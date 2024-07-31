import Link from 'next/link';
import { DataProvider } from '@/DataProvider';

async function getData(keyword: string) {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getPuzzle(keyword);
}

export async function generateStaticParams() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getPuzzles();
}

export default async function Puzzle({ params }: { params: { slug: string } }) {
    const data = await getData(params.slug);
    const authors = data.authors.map((item) => (
        <Link href={`/author/${item.slug}`} key={item.slug}>
            {item.name}&nbsp;
        </Link>
    ));
    const keywords = data.keywords.map((item) => (
        <p key={item.slug}>
            <Link href={`/keyword/${item.slug}`}>{item.name}&nbsp;</Link>
        </p>
    ));

    return (
        <main>
            <h1>
                <Link href={'/'}>中国谜题索引</Link>：主题词详情
            </h1>
            <br />
            <h2>{data.name}</h2>
            <br />
            <p>
                解谜活动：<Link href={`/activity/${data.activity.slug}`}>{data.activity.name}</Link>
            </p>
            <p>轮次/题号：{data.roundOrNumber}</p>
            <p>作者：{authors}</p>
            <p>
                解谜活动：
                <Link href={data.puzzlePage} target="_blank" rel="noreferrer noopener">
                    查看谜题
                </Link>
            </p>
            <p>
                解谜活动：
                <Link href={data.solutionPage} target="_blank" rel="noreferrer noopener">
                    查看解析
                </Link>
            </p>
            <br />
            <h3>主题词</h3>
            <br />
            <div>{keywords}</div>
        </main>
    );
}
