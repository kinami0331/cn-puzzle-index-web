import Link from 'next/link';
import { DataProvider } from '@/DataProvider';

async function getData(keyword: string) {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getActivity(keyword);
}

export async function generateStaticParams() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getActivities();
}

export default async function Page({ params }: { params: { slug: string } }) {
    const data = await getData(params.slug);

    const authors = data.authors.map((item) => (
        <p key={item.slug}>
            <Link href={`/author/${item.slug}`}>{item.name}&nbsp;</Link>
        </p>
    ));

    const puzzles = data.puzzles.map((item) => (
        <p key={item.slug}>
            <Link href={`/puzzle/${item.slug}`}>{item.name}&nbsp;</Link>
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
            <h3>谜题</h3>
            <br />
            <div>{puzzles}</div>
            <br />
            <h3>作者</h3>
            <br />
            <div>{authors}</div>
        </main>
    );
}
