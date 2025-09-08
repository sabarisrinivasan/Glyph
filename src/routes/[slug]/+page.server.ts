// src/routes/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';

type ShortLink = {
  id: string;
  slug: string;
  target: string;
};

export const load = async ({ params, locals }) => {
  const { slug } = params;
  if (!slug) throw error(404, 'Not found');

  // Fetch the short link by slug. Requires public list/view rules on short_links.
  let rec: ShortLink;
  try {
    rec = await locals.pb
      .collection('short_links')
      .getFirstListItem<ShortLink>(`slug="${slug}"`);
  } catch {
    throw error(404, 'Not found');
  }

  return {
    slug,
    target: rec.target
  };
};
