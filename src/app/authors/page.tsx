import Link from 'next/link';
import { DataProvider } from '@/DataProvider';

async function getData() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getAuthors();
}

export default async function Page() {
    const data = await getData();
    const items = data.map((item) => (
        <div key={item.slug}>
            <Link href={`/author/${item.slug}`}>{item.name}</Link>
        </div>
    ));
    return (
        <main>
            <h1>
                <Link href={'/'}>中国谜题索引</Link>：主题词
            </h1>
            <br />
            {items}
        </main>
    );
}
