import { expect } from 'chai';
import nock from 'nock';
import Client from '../lib/client.js';

let client = new Client('api_key')
import Organization from '../lib/models/organization.js';
import OrganizationBillingConfiguration from '../lib/models/organization_billing_configuration.js';

describe('Successfully sent organization update status responds with 2xx', () => {
    before(() => {
        nock.cleanAll()
        nock('https://api.getlago.com')
            .put('/api/v1/organizations')
            .reply(200, {});
    });

    it('returns response', async () => {
        let response = await client.updateOrganization(
            new Organization({
                webhookUrl: 'new url',
                billingConfiguration: new OrganizationBillingConfiguration("footer", 15.5),
            })
        )

        expect(response).to.be
    });
});

describe('Status code is not 2xx', () => {
    let errorMessage = 'The HTTP status of the response: 422, URL: https://api.getlago.com/api/v1/organizations'

    before(() => {
        nock.cleanAll()
        nock('https://api.getlago.com')
            .put('/api/v1/organizations')
            .reply(422);
    });

    it('raises an exception', async () => {
        try {
            await client.updateOrganization(new Organization({webhookUrl: 'new url', vatRate: 15.5}))
        } catch (err) {
            expect(err.message).to.eq(errorMessage)
        }
    });
});
