import { ID } from 'shared/shared-types';

import { EntityIdStrategy } from '../../config/entity-id-strategy/entity-id-strategy';
import { VendureEntity } from '../../entity/base/base.entity';

/**
 * This service is responsible for encoding/decoding entity IDs according to the configured EntityIdStrategy.
 * It should only need to be used in resolvers - the design is that once a request hits the business logic layer
 * (ProductService etc) all entity IDs are in the form used as the primary key in the database.
 */
export class IdCodec {
    constructor(private entityIdStrategy: EntityIdStrategy) {}

    /**
     * Decode an id from the client into the format used as the database primary key.
     * Acts recursively on all objects containing an "id" property.
     *
     * @param target - The object to be decoded
     * @param transformKeys - An optional array of keys of the target to be decoded. If not defined,
     * then the default recursive behaviour will be used.
     * @return A decoded clone of the target
     */
    decode<T extends string | number | object | undefined>(target: T, transformKeys?: string[]): T {
        const transformKeysWithId = [...(transformKeys || []), 'id'];
        return this.transformRecursive(
            target,
            input => this.entityIdStrategy.decodeId(input),
            transformKeysWithId,
        );
    }

    /**
     * Encode any entity ids according to the encode.
     * Acts recursively on all objects containing an "id" property.
     *
     * @param target - The object to be encoded
     * @param transformKeys - An optional array of keys of the target to be encoded. If not defined,
     * then the default recursive behaviour will be used.
     * @return An encoded clone of the target
     */
    encode<T extends string | number | boolean | object | undefined>(target: T, transformKeys?: string[]): T {
        const transformKeysWithId = [...(transformKeys || []), 'id'];
        return this.transformRecursive(
            target,
            input => this.entityIdStrategy.encodeId(input),
            transformKeysWithId,
        );
    }

    private transformRecursive<T>(target: T, transformFn: (input: any) => ID, transformKeys?: string[]): T {
        // noinspection SuspiciousInstanceOfGuard
        if (
            target == null ||
            typeof target === 'boolean' ||
            target instanceof Promise ||
            target instanceof Date ||
            target instanceof RegExp
        ) {
            return target;
        }
        if (typeof target === 'string' || typeof target === 'number') {
            return transformFn(target as any) as any;
        }

        if (Array.isArray(target)) {
            (target as any) = target.slice(0);
            if (target.length === 0 || typeof target[0] === 'string' || typeof target[0] === 'number') {
                return target;
            }
            const isSimpleObject = this.isSimpleObject(target[0]);
            if (isSimpleObject) {
                const length = target.length;
                for (let i = 0; i < length; i++) {
                    target[i] = this.transform(target[i], transformFn, transformKeys);
                }
            } else {
                const length = target.length;
                for (let i = 0; i < length; i++) {
                    target[i] = this.transformRecursive(target[i], transformFn, transformKeys);
                }
            }
        } else {
            target = this.transform(target, transformFn, transformKeys);
            for (const key of Object.keys(target)) {
                if (this.isObject(target[key])) {
                    target[key] = this.transformRecursive(target[key], transformFn, transformKeys);
                }
            }
        }
        return target;
    }

    private transform<T>(target: T, transformFn: (input: any) => ID, transformKeys?: string[]): T {
        const clone = Object.assign({}, target);
        if (transformKeys) {
            for (const key of transformKeys) {
                if (target.hasOwnProperty(key)) {
                    const val = target[key];
                    if (Array.isArray(val)) {
                        clone[key] = val.map(v => transformFn(v));
                    } else {
                        clone[key] = transformFn(val);
                    }
                }
            }
        }
        return clone;
    }

    private isSimpleObject(target: any): boolean {
        const values = Object.values(target);
        for (const value of values) {
            if (this.isObject(value)) {
                return false;
            }
        }
        return true;
    }

    private isObject(target: any): target is object {
        return typeof target === 'object' && target != null;
    }
}
