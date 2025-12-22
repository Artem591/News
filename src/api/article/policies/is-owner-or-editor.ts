export default async (policyContext, config, { strapi }) => {
    const { user } = policyContext.state;
    const { id } = policyContext.request.params;

    if (!user) {
        strapi.log.error(`No authenticated user for article ${id}`);
        return false;
    }

    const foundUser = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user.id,
        {
            populate: ['role']
        }
    );

    const article = await strapi.entityService.findOne('api::article.article', id, {
        populate: ['author'],
    });

    if (!article) {
        strapi.log.warn(`Article ${id} not found`);
        return false;
    }

    const isEditor = foundUser.role.name === 'Editor';
    const isAuthor = article.author?.id === user.id;

    if(isEditor || isAuthor){
        strapi.log.info(`User ${user.id} (${foundUser.email}) ${isEditor ? 'as Editor' : `as Author to article ${id} "${article.title}`}`);
        return true;
    }
    else
    {
        strapi.log.error(`User ${user.id} (${foundUser.email}) isn't Editor or author`);
        return false;
    }
};