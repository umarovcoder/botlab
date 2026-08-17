import { Route as rootRouteImport } from './routes/__root';
import { Route as IndexRouteImport } from './routes/index';
import { Route as AuthRouteImport } from './routes/auth';
import { Route as AppRouteImport } from './routes/app';
import { Route as AppBotsRouteImport } from './routes/app.bots';
import { Route as AppBotsNewRouteImport } from './routes/app.bots.new';
import { Route as AppAnalyticsRouteImport } from './routes/app.analytics';
import { Route as AppConversationsRouteImport } from './routes/app.conversations';
import { Route as AppKnowledgeRouteImport } from './routes/app.knowledge';
import { Route as AppLeadsRouteImport } from './routes/app.leads';
import { Route as AppSettingsRouteImport } from './routes/app.settings';

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any);
const AuthRoute = AuthRouteImport.update({ id: '/auth', path: '/auth', getParentRoute: () => rootRouteImport } as any);
const AppRoute = AppRouteImport.update({ id: '/app', path: '/app', getParentRoute: () => rootRouteImport } as any);
const AppBotsRoute = AppBotsRouteImport.update({ id: '/app/bots', path: '/app/bots', getParentRoute: () => AppRoute } as any);
const AppBotsNewRoute = AppBotsNewRouteImport.update({ id: '/app/bots/new', path: '/app/bots/new', getParentRoute: () => AppRoute } as any);
const AppAnalyticsRoute = AppAnalyticsRouteImport.update({ id: '/app/analytics', path: '/app/analytics', getParentRoute: () => AppRoute } as any);
const AppConversationsRoute = AppConversationsRouteImport.update({ id: '/app/conversations', path: '/app/conversations', getParentRoute: () => AppRoute } as any);
const AppKnowledgeRoute = AppKnowledgeRouteImport.update({ id: '/app/knowledge', path: '/app/knowledge', getParentRoute: () => AppRoute } as any);
const AppLeadsRoute = AppLeadsRouteImport.update({ id: '/app/leads', path: '/app/leads', getParentRoute: () => AppRoute } as any);
const AppSettingsRoute = AppSettingsRouteImport.update({ id: '/app/settings', path: '/app/settings', getParentRoute: () => AppRoute } as any);

export const routeTree = rootRouteImport._addFileChildren({
  IndexRoute,
  AuthRoute,
  AppRoute,
  AppBotsRoute,
  AppBotsNewRoute,
  AppAnalyticsRoute,
  AppConversationsRoute,
  AppKnowledgeRoute,
  AppLeadsRoute,
  AppSettingsRoute,
})._addFileTypes<any>();
