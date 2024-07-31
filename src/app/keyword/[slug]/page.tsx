import { DataProvider } from '@/DataProvider';
import { Fragment } from 'react';

async function getData(keyword: string) {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getKeyword(keyword);
}

export async function generateStaticParams() {
    const dataProvider = DataProvider.getInstance();
    return await dataProvider.getKeywords();
}

export default async function Page({ params }: { params: { slug: string } }) {
    const data = await getData(params.slug);

    const puzzles = data.puzzles.map((item) => (
        <p key={item.slug}>
            <a href={`${process.env.BASE_PATH}/puzzle/${item.slug}`}>{item.name}</a>
        </p>
    ));

    const categories = data.categories.map((item) => {
        let curItem = item;
        let categories = [curItem];
        while (curItem.parent) {
            categories.push(curItem.parent);
            curItem = curItem.parent;
        }
        categories.reverse();
        return (
            <p key={item.slug}>
                {categories.map((item, index) => (
                    <Fragment key={index}>
                        {index > 0 && ' -> '}
                        <a href={`${process.env.BASE_PATH}/category/${item.slug}`}>{item.name}</a>
                    </Fragment>
                ))}
            </p>
        );
    });

    return (
        <main>
            <h1>
                <a href={`${process.env.BASE_PATH}/`}>中国谜题索引</a>：主题词详情
            </h1>
            <br />
            <h2>{data.name}</h2>
            <br />
            <p>{data.profile}</p>
            <br />
            <h3>谜题</h3>
            <br />
            <div>{puzzles}</div>
            <br />
            <h3>类目</h3>
            <br />
            <div>{categories}</div>
        </main>
    );
}
