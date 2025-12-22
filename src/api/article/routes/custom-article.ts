export default {
    routes: [
        {
            method: 'POST',
            path: '/articles/:id/publish',
            handler: 'api::article.article.publish',
            config: {
                policies: [],
            },
        },
        {
            method: 'GET',
            path: '/articles/:id/author',
            handler: 'api::article.article.getAuthor',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ]
}