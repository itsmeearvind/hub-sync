import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import myEvent from './extensions/backend/events/my-event/my-event.extension.ts';

export default app()
  .use(myPage).use(myEvent);
