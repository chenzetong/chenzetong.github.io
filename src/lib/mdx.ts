import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getArticleBySlug(slug: string) {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'src/content/posts', `${slug}.mdx`),
    'utf8'
  );

  const { content, data } = matter(source);
  const html = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  return {
    content: html.toString(),
    frontmatter: data,
  };
}

export async function getAllArticles() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/posts'));

  const articles = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const source = fs.readFileSync(
          path.join(process.cwd(), 'src/content/posts', file),
          'utf8'
        );
        const { data } = matter(source);
        const slug = file.replace(/\.mdx$/, '');

        return {
          ...data,
          slug,
        };
      })
  );

  return articles.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
} 