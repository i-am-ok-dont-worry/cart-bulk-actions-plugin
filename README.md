# Cart bulk actions plugin
Provides support for bulk actions on quote items such as:
- add to cart multiple products
- update multiple cart items
- delete multiple cart items
- clear quote

## API
Plugin exposes endpoints:
* `POST /vendor/cart-bulk/{{cartId}}` - adds or updates multiple products at once
* `DELETE /vendor/cart-bulk/{{cartId}}` - removes multiple products from quote or clears quote

## Bulk add
To add multiple products at once:
POST on `/vendor/cart-bulk/{{cartId}}`
* request body: `[{ sku: string, qty: string, quoteId: string }]`

## Bulk update
To add multiple products at once:
POST on `/vendor/cart-bulk/{{cartId}}`
* request body: `[{ sku: string, qty: string, quoteId: string, item_id: string }]`

## Bulk delete
To remove multiple cart items from quote at once:
DELETE on `/vendor/cart-bulk/{{cartId}}`
* request body: `[{{itemId}}]`

To clear whole quote:
DELETE on `/vendor/cart-bulk/{{cartId}}` with empty body
