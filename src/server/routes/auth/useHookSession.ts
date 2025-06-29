/* useLuciaAuth用のセッション取得API */

import { Hono } from 'hono';
import { getSession } from '../../lib/getSession';

export const hookSession = new Hono().get('/useSession', async (c) => {
    const session = await getSession(c);

    if (!session) {
        return c.json({ user: null, flg: false });
    }
    return c.json({ user: { id: session.userId }, flg: true });
});
