import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent } from '../../../common/component-registry-types';

/**
 * @description
 * Displays a number input. Default input for `int` and `float` type fields.
 *
 * @docsCategory custom-input-components
 * @docsPage default-inputs
 */
@Component({
    selector: 'vdr-number-form-input',
    templateUrl: './number-form-input.component.html',
    styleUrls: ['./number-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'number-form-input';
    @Input() readonly: boolean;
    formControl: FormControl;
    config: DefaultFormComponentConfig<'number-form-input'>;
}
