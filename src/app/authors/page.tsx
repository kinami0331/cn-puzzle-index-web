import { DataProvider } from '@/DataProvider';

async function getData() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getAuthors();
}

export default async function Page() {
    const data = await getData();
    const items = data.map((item) => (
        <div key={item.slug}>
            <a href={`${process.env.BASE_PATH}/author/${item.slug}`}>{item.name}</a>
        </div>
    ));
    return (
        <main>
            <h1>
                <a href={`${process.env.BASE_PATH}/`}>中国谜题索引</a>：作者
            </h1>
            <br />
            {items}
        </main>
    );
}
