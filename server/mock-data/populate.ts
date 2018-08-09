import { devConfig } from '../dev-config';
import { setConfig } from '../src/config/vendure-config';

import { clearAllTables } from './clear-all-tables';
import { MockDataClientService } from './mock-data-client.service';

async function populate() {
    setConfig(devConfig);
    await clearAllTables(devConfig.dbConnectionOptions);

    const mockDataClientService = new MockDataClientService(devConfig);
    await mockDataClientService.populateOptions();
    await mockDataClientService.populateProducts(200);
    await mockDataClientService.populateCustomers(100);
    await mockDataClientService.populateAdmins();
}

// tslint:disable:no-floating-promises
populate().then(() => process.exit(0));
