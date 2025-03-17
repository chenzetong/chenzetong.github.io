import { bundleMDX } from 'mdx-bundler';
import rehypeHighlight from 'rehype-highlight';
import rehypeImgSize from 'rehype-img-size';
import remarkGfm from 'remark-gfm';
import fs from 'fs';
import path from 'path';

export async function getMDXContent(source: string) {
  const { code, frontmatter } = await bundleMDX({
    source,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeHighlight,
        [rehypeImgSize, { dir: 'public' }],
      ];
      return options;
    },
  });

  return {
    code,
    frontmatter,
  };
}

export async function getArticleBySlug(slug: string) {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'src/content/posts', `${slug}.mdx`),
    'utf8'
  );

  const { code, frontmatter } = await getMDXContent(source);

  return {
    code,
    frontmatter: {
      ...frontmatter,
      slug,
    },
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
        const { frontmatter } = await getMDXContent(source);
        const slug = file.replace(/\.mdx$/, '');

        return {
          ...frontmatter,
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