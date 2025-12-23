export default {
  async getMyRole(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized();
    }

    const fullUser = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      populate: ['role'],
    });

    ctx.body = {
      roleId: fullUser.role.id,
      roleName: fullUser.role.name,
    };
  },
};
