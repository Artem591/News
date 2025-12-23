export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }

    const ctx = strapi.requestContext.get();
    const user = ctx?.state?.user;

    if (user && !data.author) {
      data.author = user.id;
    }
  },
};

function generateSlug(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
  }
  return `art-${Math.abs(hash).toString(36)}`;
}
