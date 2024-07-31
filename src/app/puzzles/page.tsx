import Link from 'next/link';
import { DataProvider } from '@/DataProvider';

async function getData() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getPuzzles();
}

export default async function Puzzles() {
    const data = await getData();
    const items = data.map((item) => (
        <div key={item.slug}>
            <Link href={`/puzzle/${item.slug}`}>{item.name}</Link>
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
