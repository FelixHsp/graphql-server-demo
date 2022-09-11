/*
 * @Author: Felix 
 * @Date: 2022-09-11 14:57:49 
 * @Last Modified by: Felix
 * @Last Modified time: 2022-09-11 16:10:02
 */

import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import cors from 'koa-cors';

import resolvers from './resolvers';
import LaunchAPI from './dataSources/launch';

import typeDefs from './schema';

const app = new Koa();

app.use(cors());

const startApp = async () => {
  // 实例化ApolloServer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      launchAPI: new LaunchAPI(),
    }),
    introspection: true
  });

  await server.start();

  // 将 server 实例以中间件的形式挂载到 app 上
  server.applyMiddleware({ app });

  // 启动 web 服务
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000/graphql`)
  );
};

startApp();