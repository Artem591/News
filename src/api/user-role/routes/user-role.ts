export default {
  routes: [
    {
      method: 'GET',
      path: '/my-role',
      handler: 'user-role.getMyRole',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};