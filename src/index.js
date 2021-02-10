const isNumeric = (val) => Number(parseFloat(val)).toString() === val;

/**
 * Plugin allows to handle bulk actions on Magento quote
 * @param config
 * @param db
 * @param router
 * @param cache
 * @param apiStatus
 * @param apiError
 * @param getRestApiClient
 * @returns {{router: *, route: string, pluginName: string, domainName: string}}
 */
module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('cartBulk', (restClient) => {
            const module = {};
            module.updateBulk = function (cartId, cartItems, customerToken) {
                if (customerToken && isNumeric(cartId)) {
                    return restClient.post('/carts/' + cartId + '/items-multiple', { cartItem: cartItems }, customerToken);
                } else {
                    return restClient.post('/guest-carts/' + cartId + '/items-multiple', { cartItem: cartItems });
                }
            };

            module.deleteBulk = function (cartId, itemIds, customerToken) {
                if (itemIds) {
                    if (customerToken && isNumeric(cartId)) {
                        return restClient.post('/carts/' + cartId + '/items-delete-multiple', { itemIds }, customerToken);
                    } else {
                        return restClient.post('/guest-carts/' + cartId + '/items-delete-multiple', { itemIds });
                    }
                } else {
                    if (customerToken && isNumeric(cartId)) {
                        return restClient.delete('/carts/' + cartId + '/items-all', customerToken);
                    } else {
                        return restClient.delete('/guest-carts/' + cartId + '/items-all');
                    }
                }
            };

            return module;
        });

        return client;
    };

    /**
     * Adds or updates multiple objects in quote
     *
     * @req.query.token user token
     * @req.body cart items to add or update
     *
     * @returns {{item_id?: string, qty: number, sku: string, error?: string }[]} list of products that were passed through the method.
     * Items that were not added or updated are extended with 'error' property
     */
    router.post('/:cartId', (req, res) => {
        const cartItems = req.body;
        const { token } = req.query;
        const { cartId } = req.params;
        const client = createMage2RestClient();
        try {
            client.cartBulk.updateBulk(cartId, cartItems, token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Deletes multiple objects in quote or clears quote entirely
     * If body is empty the whole cart will be cleared.
     *
     * @req.query.token user token
     * @req.body cart items to delete
     *
     * @returns {{item_id?: string, qty: number, sku: string, error?: string }[]} list of products that were passed through the method.
     * Items that were not added or updated are extended with 'error' property
     */
    router.delete('/:cartId', (req, res) => {
        const cartItems = req.body;
        const { token } = req.query;
        const { cartId } = req.params;
        const client = createMage2RestClient();
        try {
            client.cartBulk.deleteBulk(cartId, cartItems, token)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    return {
        domainName: '@grupakmk',
        pluginName: 'cart-bulk-actions-plugin',
        route: '/cart-bulk',
        router
    };
};
