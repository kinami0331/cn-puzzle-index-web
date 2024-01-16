import Link from "next/link";

async function getData(keyword: string) {
    const res = await fetch(`${process.env.API_URL}/category?slug=${keyword}`);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export async function generateStaticParams() {
    const data = await fetch(`${process.env.API_URL}/categories/`).then((res) => res.json());
    let categoriesList = data;

    for (let i = 0; i < data.length; i++) {
        // console.log(data[i]);
        const tData = await getData(data[i].slug);
        if (!!tData.childs) {
            for (let j = 0; j < tData.childs; j++) {
                categoriesList.push({name: tData.childs[j].name, slug: tData.childs[j].slug});
                categoriesList.concat(tData.childs[j].keywords);
            }
        }
    }

    console.log(categoriesList);
    // @ts-ignore
    return categoriesList.map((item) => ({
        slug: item.slug,
    }));
}

export default async function Page({params}: { params: { slug: string } }) {
    const data = await getData(params.slug);
    console.log(data);

    const children = data.childs ? data.childs.map(
        // @ts-ignore
        item => <div key={item.slug}>
            <h3><Link href={`/category/${item.slug}`} style={{color: "#fffdf7"}}>{item.name}</Link></h3>
            <br/>
            {/* @ts-ignore */}
            {item.keywords.map(k => <p key={k.slug}><Link href={`/keyword/${k.slug}`}>{k.name}</Link></p>)}
            <br/>
        </div>
    ) : [];

    const keywords = data.keywords ? data.keywords.map(
        // @ts-ignore
        k => <p key={k.slug}><Link href={`/keyword/${k.slug}`}>{k.name}</Link></p>
    ) : [];


    return <main>
        <h1><Link href={"/"}>中国谜题索引</Link>：主题词详情</h1>
        <br/>
        <h2>{data.name}</h2>
        <br/>
        {data.profile !== "" && <><p>{data.profile}</p><br/></>}
        {children}
        {keywords}

    </main>;
}