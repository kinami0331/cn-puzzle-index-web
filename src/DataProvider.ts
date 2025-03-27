import 'server-only';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import assert from 'node:assert';
// @ts-ignore
import pinyin from 'pinyin';

type AuthorItem = {
    slug: string;
    name: string;
    puzzles: PuzzleItem[];
    activities: ActivityItem[];
};

type ActivityItem = {
    slug: string;
    name: string;
    puzzles: PuzzleItem[];
    authors: AuthorItem[];
};

type CategoryItem = {
    slug: string;
    name: string;
    profile: string;
    parentSlug: string;
    parent?: CategoryItem;
    children: CategoryItem[];
    keywords: KeywordItem[];
};

type KeywordItem = {
    slug: string;
    name: string;
    profile: string;
    categorySlugs: string[];
    categories: CategoryItem[];
    puzzles: PuzzleItem[];
};

type PuzzleItem = {
    slug: string;
    name: string;
    activitySlug: string;
    activity: ActivityItem;
    roundOrNumber: string;
    authorSlugs: string[];
    authors: AuthorItem[];
    keywordSlugs: string[];
    keywords: KeywordItem[];
    puzzlePage: string;
    solutionPage: string;
};

function toPinyin(text: string) {
    let result = '';
    for (const char of text) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
            const charPinyin = pinyin(char, { style: pinyin.STYLE_TONE2, heteronym: false });
            if (charPinyin.length === 0 || charPinyin[0].length === 0) result += 'unknown';
            else result += charPinyin[0];
        } else {
            result += char;
        }
    }
    return result;
}

function isAscii(str: string) {
    return /^[0-9a-z-]+$/.test(str);
}

export class DataProvider {
    private static instance?: DataProvider;
    private static dataPath = path.join(process.cwd(), './data');

    private authors: Map<string, AuthorItem> = new Map();
    private keywords: Map<string, KeywordItem> = new Map();
    private activities: Map<string, ActivityItem> = new Map();
    private puzzles: Map<string, PuzzleItem> = new Map();
    private categories: Map<string, CategoryItem> = new Map();

    private constructor() {
        this.readData();
    }

    private readData() {
        const puzzlesPath = path.join(DataProvider.dataPath, 'puzzles.csv');
        const authorsPath = path.join(DataProvider.dataPath, 'authors.csv');
        const keywordsPath = path.join(DataProvider.dataPath, 'keywords.csv');
        const activitiesPath = path.join(DataProvider.dataPath, 'activities.csv');
        const categoryPath = path.join(DataProvider.dataPath, 'categories.csv');

        const authors = parse(fs.readFileSync(authorsPath, 'utf-8'), {
            columns: false,
            fromLine: 2,
            skipEmptyLines: true,
        }) as [string, string][];
        for (const author of authors) {
            assert(isAscii(author[0]), `author slug '${author[0]}' does not satisfy the [a-z-]+ pattern!`);
            this.authors.set(author[0], { slug: author[0], name: author[1], puzzles: [], activities: [] });
        }

        const activities = parse(fs.readFileSync(activitiesPath, 'utf-8'), {
            columns: false,
            fromLine: 2,
            skipEmptyLines: true,
        }) as [string, string][];
        for (const activity of activities) {
            assert(isAscii(activity[0]), `activity slug '${activity[0]}' does not satisfy the [a-z-]+ pattern!`);
            this.activities.set(activity[0], { slug: activity[0], name: activity[1], authors: [], puzzles: [] });
        }

        const categories = parse(fs.readFileSync(categoryPath, 'utf-8'), {
            columns: false,
            fromLine: 2,
            skipEmptyLines: true,
        }) as [string, string, string, string][];
        for (const category of categories) {
            assert(isAscii(category[0]), `category slug '${category[0]}' does not satisfy the [a-z-]+ pattern!`);
            this.categories.set(category[0], {
                slug: category[0],
                name: category[1],
                profile: category[2],
                parentSlug: category[3],
                parent: undefined,
                children: [],
                keywords: [],
            });
        }

        for (const [_, category] of this.categories) {
            if (category.parentSlug !== '') {
                assert(
                    this.categories.has(category.parentSlug),
                    `category slug '${category.parentSlug}' doesn't exist!`,
                );
                assert(
                    isAscii(category.parentSlug),
                    `category parent slug '${category.parentSlug}' does not satisfy the [a-z-]+ pattern!`,
                );
                category.parent = this.categories.get(category.parentSlug);
                category.parent!.children.push(category);
            }
        }

        const keywords = parse(fs.readFileSync(keywordsPath, 'utf-8'), {
            columns: false,
            fromLine: 2,
            skipEmptyLines: true,
        }) as [string, string, string, string][];
        for (const keyword of keywords) {
            const categorySlugs = keyword[2].split(',');
            let categories: CategoryItem[] = [];
            for (const categorySlug of categorySlugs) {
                assert(this.categories.has(categorySlug), `category slug '${categorySlug}' doesn't exist!`);
                categories.push(this.categories.get(categorySlug)!);
            }
            assert(isAscii(keyword[0]), `keyword slug '${keyword[0]}' does not satisfy the [a-z-]+ pattern!`);
            const keywordItem = {
                slug: keyword[0],
                name: keyword[1],
                profile: keyword[3],
                categories: categories,
                categorySlugs: categorySlugs,
                puzzles: [],
            };

            this.keywords.set(keyword[0], keywordItem);

            for (const category of keywordItem.categories) category.keywords.push(keywordItem);
        }

        const puzzles = parse(fs.readFileSync(puzzlesPath, 'utf-8'), {
            columns: false,
            fromLine: 2,
            skipEmptyLines: true,
        }) as [string, string, string, string, string, string, string, string][];
        for (const puzzle of puzzles) {
            assert(this.activities.has(puzzle[2]), `activity slug '${puzzle[2]}' doesn't exist!`);
            assert(isAscii(puzzle[0]), `puzzle slug '${puzzle[0]}' does not satisfy the [a-z-]+ pattern!`);
            const puzzleActivity = this.activities.get(puzzle[2])!;

            let puzzleAuthors: AuthorItem[] = [];
            const puzzleAuthorSlugs = puzzle[4].split(',');
            for (const puzzleAuthorSlug of puzzleAuthorSlugs) {
                assert(this.authors.has(puzzleAuthorSlug), `author slug '${puzzleAuthorSlug}' doesn't exist!`);
                const author = this.authors.get(puzzleAuthorSlug)!;
                puzzleAuthors.push(author);
                if (!author.activities.some((x) => x.slug === puzzle[2])) author.activities.push(puzzleActivity);
                if (!puzzleActivity.authors.some((x) => x.slug === author.slug)) puzzleActivity.authors.push(author);
            }

            let puzzleKeywords: KeywordItem[] = [];
            const puzzleKeywordSlugs = puzzle[5] === '' ? [] : puzzle[5].split(',');
            for (const puzzleKeywordSlug of puzzleKeywordSlugs) {
                assert(this.keywords.has(puzzleKeywordSlug), `keyword slug '${puzzleKeywordSlug}' doesn't exist!`);
                const keyword = this.keywords.get(puzzleKeywordSlug)!;
                puzzleKeywords.push(keyword);
            }

            const puzzleItem: PuzzleItem = {
                slug: puzzle[0],
                name: puzzle[1],
                activitySlug: puzzle[2],
                activity: puzzleActivity,
                roundOrNumber: puzzle[3],
                authorSlugs: puzzleAuthorSlugs,
                authors: puzzleAuthors,
                keywordSlugs: puzzleKeywordSlugs,
                keywords: puzzleKeywords,
                puzzlePage: puzzle[6],
                solutionPage: puzzle[7],
            };

            this.puzzles.set(puzzle[0], puzzleItem);

            puzzleItem.keywords.map((x) => x.puzzles.push(puzzleItem));
            puzzleItem.activity.puzzles.push(puzzleItem);
            puzzleItem.authors.map((x) => x.puzzles.push(puzzleItem));

            puzzleItem.keywords = puzzleItem.keywords.sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
            puzzleItem.authors = puzzleItem.authors.sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
        }

        for (let [_, keyword] of this.keywords) {
            keyword.puzzles = keyword.puzzles.sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
            keyword.categories = keyword.categories.sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
        }
    }

    public static getInstance(): DataProvider {
        if (!DataProvider.instance) {
            DataProvider.instance = new DataProvider();
        }
        return DataProvider.instance;
    }

    public async getIndex() {
        return {
            keywords: this.keywords.size,
            puzzles: this.puzzles.size,
            activities: this.activities.size,
            authors: this.authors.size,
            categories: Array.from(this.categories).filter((x) => x[1].parent === undefined).length,
        };
    }

    public async getPuzzles() {
        return Array.from(this.puzzles)
            .map((item) => ({ slug: item[1].slug, name: item[1].name }))
            .sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
    }

    public async getPuzzle(slug: string) {
        return this.puzzles.get(slug)!;
    }

    public async getKeywords() {
        return Array.from(this.keywords)
            .map((item) => ({ slug: item[1].slug, name: item[1].name }))
            .sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
    }

    public async getKeyword(slug: string) {
        return this.keywords.get(slug)!;
    }

    public async getMainCategories() {
        return Array.from(this.categories)
            .filter((x) => x[1].parent === undefined)
            .map((item) => ({ slug: item[1].slug, name: item[1].name }))
            .sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
    }

    public async getAllCategories() {
        return Array.from(this.categories)
            .map((item) => ({ slug: item[1].slug, name: item[1].name }))
            .sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
    }

    public async getCategory(slug: string) {
        return this.categories.get(slug)!;
    }

    public async getAuthors() {
        return Array.from(this.authors)
            .map((item) => ({ slug: item[1].slug, name: item[1].name }))
            .sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
    }

    public async getAuthor(slug: string) {
        return this.authors.get(slug)!;
    }

    public async getActivities() {
        return Array.from(this.activities)
            .map((item) => ({ slug: item[1].slug, name: item[1].name }))
            .sort((a, b) => toPinyin(a.name).localeCompare(toPinyin(b.name)));
    }

    public async getActivity(slug: string) {
        return this.activities.get(slug)!;
    }
}

export type { AuthorItem, KeywordItem, ActivityItem, PuzzleItem };
