import Link from "next/link";

async function getData() {
    const res = await fetch(`${process.env.API_URL}/activities/`);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export default async function Page() {
    const data = await getData();
    console.log(data);
    // @ts-ignore
    const items = data.map((item) => <div key={item.slug}><a href={`/activity/${item.slug}`}>{item.name}</a></div>);
    return (
        <main>
            <h1><Link href={"/"}>中国谜题索引</Link>：主题词</h1>
            <br/>
            {items}
        </main>
    );
}
