import type { AnyRoute } from '@tanstack/react-router';

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; filePath: 'routes/index.tsx'; parentRoute: AnyRoute };
    '/auth': { id: '/auth'; path: '/auth'; fullPath: '/auth'; filePath: 'routes/auth.tsx'; parentRoute: AnyRoute };
    '/app': { id: '/app'; path: '/app'; fullPath: '/app'; filePath: 'routes/app.tsx'; parentRoute: AnyRoute };
    '/app/bots': { id: '/app/bots'; path: '/bots'; fullPath: '/app/bots'; filePath: 'routes/app.bots.tsx'; parentRoute: AnyRoute };
    '/app/bots/new': { id: '/app/bots/new'; path: '/bots/new'; fullPath: '/app/bots/new'; filePath: 'routes/app.bots.new.tsx'; parentRoute: AnyRoute };
    '/app/analytics': { id: '/app/analytics'; path: '/analytics'; fullPath: '/app/analytics'; filePath: 'routes/app.analytics.tsx'; parentRoute: AnyRoute };
    '/app/conversations': { id: '/app/conversations'; path: '/conversations'; fullPath: '/app/conversations'; filePath: 'routes/app.conversations.tsx'; parentRoute: AnyRoute };
    '/app/knowledge': { id: '/app/knowledge'; path: '/knowledge'; fullPath: '/app/knowledge'; filePath: 'routes/app.knowledge.tsx'; parentRoute: AnyRoute };
    '/app/leads': { id: '/app/leads'; path: '/leads'; fullPath: '/app/leads'; filePath: 'routes/app.leads.tsx'; parentRoute: AnyRoute };
    '/app/settings': { id: '/app/settings'; path: '/settings'; fullPath: '/app/settings'; filePath: 'routes/app.settings.tsx'; parentRoute: AnyRoute };
  }
}
