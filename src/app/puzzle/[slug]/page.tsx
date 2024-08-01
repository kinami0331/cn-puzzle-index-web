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
        <a href={`${process.env.BASE_PATH}/author/${item.slug}`} key={item.slug}>
            {item.name}&nbsp;
        </a>
    ));
    const keywords = data.keywords.map((item) => (
        <p key={item.slug}>
            <a href={`${process.env.BASE_PATH}/keyword/${item.slug}`}>{item.name}&nbsp;</a>
        </p>
    ));

    return (
        <main>
            <h1>
                <a href={`${process.env.BASE_PATH}/`}>中国谜题索引</a>：谜题详情
            </h1>
            <br />
            <h2>{data.name}</h2>
            <br />
            <p>
                解谜活动：<a href={`${process.env.BASE_PATH}/activity/${data.activity.slug}`}>{data.activity.name}</a>
            </p>
            <p>轮次/题号：{data.roundOrNumber}</p>
            <p>作者：{authors}</p>
            <p>
                解谜活动：
                <a href={data.puzzlePage} target="_blank" rel="noreferrer noopener">
                    查看谜题
                </a>
            </p>
            <p>
                解谜活动：
                <a href={data.solutionPage} target="_blank" rel="noreferrer noopener">
                    查看解析
                </a>
            </p>
            <br />
            <h3>关键词</h3>
            <br />
            <div>{keywords}</div>
        </main>
    );
}
