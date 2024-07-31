import type { Metadata } from 'next';
import './globals.scss';
import styles from './layout.module.scss';

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
            </head>
            <body>
                <div className={styles.globalWrapper}>
                    <div className={styles.main}>{children}</div>
                </div>
            </body>
        </html>
    );
}
