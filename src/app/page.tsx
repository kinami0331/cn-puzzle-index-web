import styles from './page.module.scss';
import Link from "next/link";

async function getData() {
    const res = await fetch(`${process.env.API_URL}/index`);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export default async function Home() {
    const data = await getData();
    console.log(data);
    return (
        <main className={styles.main}>

            <h1>中国谜题</h1>
            <p>探索中国丰富文化与历史的独特指南，汇集了各类谜题、挑战和趣味知识，引领你深入中华文明的奥秘。</p><br/>
            <h2>索引中有什么？</h2><br/><p>2021-2023 年的部分解谜活动已编入索引。非常感谢 Ender_nor 帮助添加CCBC
            11-14、P&amp;KU 1-2 的内容，以及所有帮助填补《谜题索引》档案中空白的人们。</p><br/>
            <h2>我如何访问它？</h2><br/><p>通过以下任何一种方式：</p><br/>
            <ul>
                <li><Link href="/keywords">查看所有主题词（{data.keywords}）</Link></li>
                <li><Link href="/puzzles">查看所有谜题（{data.puzzles}）</Link></li>
                <li><Link href="/categories">查看所有类目（{data.categories}）</Link></li>
                <li><Link href="/activities">查看所有解谜活动（{data.categories}）</Link></li>
                <li><Link href="/authors">查看所有作者（{data.authors}）</Link></li>
            </ul>
            <br/><h2>还有什么要补充的？</h2><br/>
            <p>如果您希望将您策划的解谜活动刊登，或对类目、关键词、作者、谜题等进行增改，</p>
            <p>请将详细且准确的信息发送至 <a
                href="mailto:contact@miaomiaomiao.team">contact@miaomiaomiao.team</a> ，我们将在审核后更新在页面中。
            </p><br/>
            <ul>
                <li>主题词、类目、解谜活动简介</li>
                <li>CCBC 1-CCBC 10 没有可用的线上归档</li>
                <li>P&amp;KU Zero 没有可用的线上归档</li>
                <li>MiaoHunt 2023 活动归档中</li>
                <li>……</li>
            </ul>
            <br/><h2>关于未来</h2><br/>
            <p>我们正在考虑将其他解谜活动添加到该索引中。为了维护规范，解谜活动应该：</p><br/>
            <ul>
                <li>可以免费在线访问</li>
                <li>在一段时间内具有稳定的Url链接</li>
                <li>在某处有可免费访问的解析</li>
                <li>不是在进行中的活动（即，玩家不再被要求对谜题解析保密）</li>
            </ul>

        </main>
    );
}
