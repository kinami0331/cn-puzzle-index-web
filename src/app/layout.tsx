import type { Metadata } from 'next';
import './globals.scss';
import styles from './layout.module.scss';
import beiAn from './(assets)/beian.png';
import favicon from './(assets)/favicon.ico';

export const metadata: Metadata = {
    title: '中国谜题索引',
    description: '探索中国丰富文化与历史的独特指南，汇集了各类谜题、挑战和趣味知识，引领你深入中华文明的奥秘。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-Hans-CN">
            <head>
                <title>中国谜题索引</title>
                <meta charSet={'utf-8'} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
                />
                <link rel="icon" href={favicon.src} type="image/x-icon" />
            </head>
            <body>
                <div className={styles.globalWrapper}>
                    <div className={styles.main}>{children}</div>
                    <br />
                </div>
                {process.env.BEI_AN_MODE === 'TRUE' && (
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: 12,
                            height: 48,
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <span style={{ color: 'white' }}>Miaomiaomiao Studio ©2023 - All Rights Reserved.</span>
                        <span>
                            <a href={'http://beian.miit.gov.cn'} style={{ color: '#f5aaa3' }}>
                                津ICP备2022000942号-3
                            </a>
                            &nbsp;
                            <img
                                src={beiAn.src}
                                alt="beian"
                                style={{ width: 16, height: 16, marginTop: -3, verticalAlign: 'middle' }}
                            />
                            &nbsp;
                            <a
                                href={'https://beian.mps.gov.cn/#/query/webSearch?code=12010402001977'}
                                style={{ color: '#f5aaa3' }}
                            >
                                津公网安备 12010402001977号
                            </a>
                        </span>
                    </div>
                )}
            </body>
        </html>
    );
}
