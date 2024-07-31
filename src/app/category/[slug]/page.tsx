import Link from 'next/link';
import { DataProvider } from '@/DataProvider';

async function getData(keyword: string) {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getCategory(keyword);
}

export async function generateStaticParams() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getAllCategories();
}

export default async function Page({ params }: { params: { slug: string } }) {
    const data = await getData(params.slug);

    const children = data.children.map((item) => (
        <div key={item.slug}>
            <h3>
                <Link href={`/category/${item.slug}`} style={{ color: '#fffdf7' }}>
                    {item.name}
                </Link>
            </h3>
            <br />
            {item.keywords.map((k) => (
                <p key={k.slug}>
                    <Link href={`/keyword/${k.slug}`}>{k.name}</Link>
                </p>
            ))}
            <br />
        </div>
    ));

    const keywords = data.keywords.map((k) => (
        <p key={k.slug}>
            <Link href={`/keyword/${k.slug}`}>{k.name}</Link>
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
            {data.profile !== '' && (
                <>
                    <p>{data.profile}</p>
                    <br />
                </>
            )}
            {children}
            {keywords}
        </main>
    );
}
