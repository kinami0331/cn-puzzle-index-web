import { DataProvider } from '@/DataProvider';

async function getData() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getKeywords();
}

export default async function Keywords() {
    const data = await getData();
    const items = data.map((item) => (
        <div key={item.slug}>
            <a href={`${process.env.BASE_PATH}/keyword/${item.slug}`}>{item.name}</a>
        </div>
    ));
    return (
        <main>
            <h1>
                <a href={`${process.env.BASE_PATH}/`}>中国谜题索引</a>：关键词
            </h1>
            <br />
            {items}
        </main>
    );
}
