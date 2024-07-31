import { DataProvider } from '@/DataProvider';

async function getData(keyword: string) {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getAuthor(keyword);
}

export async function generateStaticParams() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getAuthors();
}

export default async function Page({ params }: { params: { slug: string } }) {
    const data = await getData(params.slug);

    const puzzles = data.puzzles.map((item) => (
        <p key={item.slug}>
            <a href={`${process.env.BASE_PATH}/puzzle/${item.slug}`}>{item.name}&nbsp;</a>
        </p>
    ));

    return (
        <main>
            <h1>
                <a href={`${process.env.BASE_PATH}/`}>中国谜题索引</a>：作者详情
            </h1>
            <br />
            <h2>{data.name}</h2>
            <br />
            <h3>谜题</h3>
            <br />
            <div>{puzzles}</div>
        </main>
    );
}
