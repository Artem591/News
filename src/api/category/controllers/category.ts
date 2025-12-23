/**
 * category controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::category.category', ({ strapi }) => ({
  async delete(ctx) {
    const { id } = ctx.params;

    try {
      const category = await strapi.entityService.findOne('api::category.category', id);

      if (!category) {
        return ctx.notFound('Category not found');
      }

      const result = await strapi.db.query('api::category.category').deleteMany({
        where: {
          document_id: category.documentId,
        },
      });

      strapi.log.info(
        `Deleted ${result.count} category versions with document_id: ${category.documentId}`
      );

      ctx.status = 204;
      return;
    } catch (error) {
      strapi.log.error('Error deleting category:', error);
      return ctx.internalServerError('Failed to delete category');
    }
  },
}));
