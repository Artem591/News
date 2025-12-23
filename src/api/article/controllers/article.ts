import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async getAuthor(ctx) {
    const { id } = ctx.params;

    try {
      const article = await strapi.entityService.findOne('api::article.article', id, {
        populate: ['author'],
      });

      if (!article) {
        return ctx.notFound('Article not found');
      }
      // @ts-ignore
      if (!article.author) {
        return ctx.notFound('Author not found for this article');
      }

      const authorData = {
        // @ts-ignore
        id: article.author.id,
        // @ts-ignore
        username: article.author.username,
        // @ts-ignore
        email: article.author.email,
      };

      return {
        data: authorData,
      };
    } catch (error) {
      strapi.log.error('Error getting article author:', error);
      return ctx.internalServerError('Failed to get article author');
    }
  },
  async publish(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Only authenticated users can publish.');
    }

    if (user.role?.name !== 'Editor') {
      return ctx.forbidden('Only editors can publish articles.');
    }

    try {
      const article = await strapi.entityService.findOne('api::article.article', id);
      if (!article) {
        return ctx.notFound('Article not found.');
      }

      const updatedArticle = await strapi.entityService.update('api::article.article', id, {
        data: {
          publishedAt: new Date().toISOString(),
        },
      });

      strapi.log.info(
        `Article published: ID ${id}, Title "${article.title}", User ${user.id} (${user.email})`
      );

      return updatedArticle;
    } catch (error) {
      strapi.log.error(error);
      return ctx.internalServerError('Failed to publish article.');
    }
  },
  async delete(ctx) {
    const { id } = ctx.params;

    try {
      const article = await strapi.entityService.findOne('api::article.article', id);

      if (!article) {
        return ctx.notFound('Article not found');
      }

      const result = await strapi.db.query('api::article.article').deleteMany({
        where: {
          document_id: article.documentId,
        },
      });

      strapi.log.info(
        `Deleted ${result.count} article versions with document_id: ${article.documentId}`
      );

      ctx.status = 204;
      return;
    } catch (error) {
      strapi.log.error('Error deleting article:', error);
      return ctx.internalServerError('Failed to delete article');
    }
  },
}));
