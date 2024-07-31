import styles from './page.module.scss';
import { DataProvider } from '@/DataProvider';

async function getData() {
    return await DataProvider.getInstance().getIndex();
}

export default async function Home() {
    const data = await getData();
    return (
        <main className={styles.main}>
            <h1>中国谜题</h1>
            <p>探索中国丰富文化与历史的独特指南，汇集了各类谜题、挑战和趣味知识，引领你深入中华文明的奥秘。</p>
            <br />
            <h2>索引中有什么？</h2>
            <br />
            <p>
                2021-2023 年的部分解谜活动已编入索引。非常感谢 Ender_nor 帮助添加 CCBC 11-14、P&amp;KU 1-2
                的内容，以及所有帮助填补《谜题索引》档案中空白的人们。
            </p>
            <br />
            <h2>我如何访问它？</h2>
            <br />
            <p>通过以下任何一种方式：</p>
            <br />
            <ul>
                <li>
                    <a href={`${process.env.BASE_PATH}/keywords`}>查看所有主题词（{data.keywords}）</a>
                </li>
                <li>
                    <a href={`${process.env.BASE_PATH}/puzzles`}>查看所有谜题（{data.puzzles}）</a>
                </li>
                <li>
                    <a href={`${process.env.BASE_PATH}/categories`}>查看所有类目（{data.categories}）</a>
                </li>
                <li>
                    <a href={`${process.env.BASE_PATH}/activities`}>查看所有解谜活动（{data.categories}）</a>
                </li>
                <li>
                    <a href={`${process.env.BASE_PATH}/authors`}>查看所有作者（{data.authors}）</a>
                </li>
            </ul>
            <br />
            <h2>还有什么要补充的？</h2>
            <br />
            <p>
                目前网页的数据来自于 Miaomiaomiao Team 建立的
                <a href={'https://puzzlehunt.cn/'} target="_blank" rel="noopener noreferer">
                    中国谜题索引。
                </a>
            </p>
            <p>后续更新方式还在计划中。</p>
            <br />
            <br />
            <h2>关于未来</h2>
            <br />
            <p>我们正在考虑将其他解谜活动添加到该索引中。为了维护规范，解谜活动应该：</p>
            <br />
            <ul>
                <li>可以免费在线访问</li>
                <li>在一段时间内具有稳定的Url链接</li>
                <li>在某处有可免费访问的解析</li>
                <li>不是在进行中的活动（即，玩家不再被要求对谜题解析保密）</li>
            </ul>
        </main>
    );
}
