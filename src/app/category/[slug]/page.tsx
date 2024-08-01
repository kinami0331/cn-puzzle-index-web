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
                <a href={`${process.env.BASE_PATH}/category/${item.slug}`} style={{ color: '#fffdf7' }}>
                    {item.name}
                </a>
            </h3>
            <br />
            {item.keywords.map((k) => (
                <p key={k.slug}>
                    <a href={`${process.env.BASE_PATH}/keyword/${k.slug}`}>{k.name}</a>
                </p>
            ))}
            <br />
        </div>
    ));

    const keywords = data.keywords.map((k) => (
        <p key={k.slug}>
            <a href={`${process.env.BASE_PATH}/keyword/${k.slug}`}>{k.name}</a>
        </p>
    ));

    return (
        <main>
            <h1>
                <a href={`${process.env.BASE_PATH}/`}>中国谜题索引</a>：类别详情
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
