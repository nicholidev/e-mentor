import { ID } from '@ecomentor/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { VendureEvent } from '../ecomentor-event';

/**
 * @description
 * This event is fired whenever an coupon code of an active {@link Promotion}
 * is assigned or removed to an {@link Order}.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class CouponCodeEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public couponCode: string,
        public orderId: ID,
        public type: 'assigned' | 'removed',
    ) {
        super();
    }
}
