import { CreateRoleInput, UpdateRoleInput } from '@ecomentor/common/lib/generated-types';
import { ID } from '@ecomentor/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Role } from '../../entity';
import { EcomentorEntityEvent } from '../ecomentor-entity-event';

type RoleInputTypes = CreateRoleInput | UpdateRoleInput | ID;

/**
 * @description
 * This event is fired whenever one {@link Role} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class RoleEvent extends EcomentorEntityEvent<Role, RoleInputTypes> {
    constructor(
        ctx: RequestContext,
        entity: Role,
        type: 'created' | 'updated' | 'deleted',
        input?: RoleInputTypes,
    ) {
        super(entity, type, ctx, input);
    }
}
