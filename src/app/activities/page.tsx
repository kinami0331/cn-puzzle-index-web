import Link from 'next/link';
import { DataProvider } from '@/DataProvider';

async function getData() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getActivities();
}

export default async function Page() {
    const data = await getData();
    const items = data.map((item) => (
        <div key={item.slug}>
            <a href={`/activity/${item.slug}`}>{item.name}</a>
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
