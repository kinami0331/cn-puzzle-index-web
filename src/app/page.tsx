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
            <h2>我该如何查看？</h2>
            <br />
            <p>你可以从下面任意一种分类开始：</p>
            <br />
            <ul>
                <li>
                    <a href={`${process.env.BASE_PATH}/keywords`}>查看所有关键词（{data.keywords}）</a>
                </li>
                <li>
                    <a href={`${process.env.BASE_PATH}/puzzles`}>查看所有谜题（{data.puzzles}）</a>
                </li>
                <li>
                    <a href={`${process.env.BASE_PATH}/categories`}>查看所有类别（{data.categories}）</a>
                </li>
                <li>
                    <a href={`${process.env.BASE_PATH}/activities`}>查看所有解谜活动（{data.activities}）</a>
                </li>
                <li>
                    <a href={`${process.env.BASE_PATH}/authors`}>查看所有作者（{data.authors}）</a>
                </li>
            </ul>
            <br />
            <h2>我该如何贡献条目？</h2>
            <br />
            <p>
                目前谜题索引数据使用飞书文档维护，由脚本定期从飞书文档抓取信息 {'->'} 更新代码仓库中的数据 {'->'}{' '}
                构建网站并发布。代码仓库地址在{' '}
                <a
                    href={'https://github.com/kinami0331/cn-puzzle-index-web'}
                    rel="noreferrer noopener"
                    target={'_blank'}
                >
                    GitHub
                </a>
                。
            </p>
            <ul>
                <li>如果您有一些较小的改动建议，例如勘误、细化关键词、调整分类等，可以直接开一个新 issue 讨论。</li>
                <li>如果您有很多的谜题数据希望能加入索引，请联系维护者，直接在共享文档中更新。</li>
                <li>
                    如果您希望做一些功能上或者 UI 上的改动，直接提 Pull Request 即可，但是建议先联系维护者简单讨论一下。
                </li>
            </ul>

            <br />
            <h2>未来计划</h2>
            <br />
            <p>我们希望能尽可能多的收录中文谜题。为了方便维护和访问，被收录的谜题应该至少满足以下条件：</p>
            <ul>
                <li>可以免费在线访问，并且在一段时间内有相对稳定的题目链接。</li>
                <li>不是在进行中的活动（即，玩家不再被要求对谜题解析保密）</li>
            </ul>
            <p>除了成套的 Puzzle Hunt 之外，发布在微信公众号上的谜题也是可以收录的，希望大家踊跃投稿。</p>
        </main>
    );
}
