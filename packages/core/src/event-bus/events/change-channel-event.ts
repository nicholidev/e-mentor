import { ID, Type } from '@ecomentor/common/lib/shared-types';

import { RequestContext } from '../../api';
import { ChannelAware } from '../../common';
import { EcomentorEntity } from '../../entity';
import { EcomentorEvent } from '../ecomentor-event';

/**
 * @description
 * This event is fired whenever an {@link ChannelAware} entity is assigned or removed
 * from a channel. The entity property contains the value before updating the channels.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class ChangeChannelEvent<T extends ChannelAware & EcomentorEntity> extends EcomentorEvent {
    constructor(
        public ctx: RequestContext,
        public entity: T,
        public channelIds: ID[],
        public type: 'assigned' | 'removed',
        public entityType?: Type<T>,
    ) {
        super();
    }
}
