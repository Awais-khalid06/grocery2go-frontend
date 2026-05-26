# Grocery2Go Real App Flow

This file documents the real working flow of orders in the current app (frontend + backend behavior).

## 1) Roles In App

- Customer
- Shop Owner
- Rider (Driver)

## 2) Main Order Types

- `simpleOrder`: customer cart checkout order
- `listOrder`: clipboard/list based rider grocery order

---

## 3) Simple Order Flow (Cart Checkout)

1. Shop Owner creates products.
2. Customer adds products to cart and goes to checkout.
3. Customer pays from checkout (`cart/verify-payment`).
4. Backend creates order with type `simpleOrder`.
5. Initial order state is `pending`.
6. Shop Owner sees this in `New Orders` (`order/get-shop-orders`).
7. Shop Owner accepts or rejects (`order/accept-reject-order-owner`).
8. If accepted:
9. Order becomes `accepted by owner`.
10. It moves to Shop Owner `My Orders` (`order/get-shop-accepted-orders`).
11. Rider side `New Orders` gets this request (`order/get-rider-orders`).
12. Rider accepts or rejects (`order/accept-reject-order-rider`).
13. If rider accepts:
14. Order becomes `accepted by rider`.
15. Rider is assigned and order appears in Rider `My Orders` (`order/get-rider-accepted-orders`).
16. Rider navigates to each shop and marks pickup (`order/mark-shop-order-pickedup`).
17. Shop can mark ready for pickup (`order/mark-shop-order-ready-for-pickup`).
18. After pickups, rider navigates to customer.
19. Rider presses reached in map flow (`list/mark-rider-reached`) and rider status becomes `Arrived`.
20. Customer pays delivery charges (`list/pay-delivery-charges` + `list/verify-delivery-payment`).
21. Delivery payment status becomes `paid`.
22. Rider marks order completed (`order/change-order-status` with `completed`).
23. Final status becomes `completed`.

### Simple Order Key Statuses

- `pending`
- `accepted by owner`
- `accepted by rider`
- `completed`

### Rider Status (inside order)

- `On the way`
- `Arrived`

---

## 4) List Order Flow (Clipboard/List)

1. Customer creates a grocery list (`list/create-list`).
2. Customer requests rider (`list/request-rider`).
3. Rider gets list request and accepts/rejects (`list/accept-reject-list-order`).
4. If accepted, backend creates an `Order` with type `listOrder`.
5. Initial list-order state on order is `accepted by rider`.
6. Rider marks list item availability and adds bill (`list/buying-grocery`).
7. Order status becomes `buying grocery`.
8. Customer pays list bill (`list/send-list-bill` + `list/verify-payment`).
9. Payment status becomes `paid`.
10. Rider navigates and marks reached (`list/mark-rider-reached` -> `Arrived`).
11. Customer pays delivery charges (`list/pay-delivery-charges` + `list/verify-delivery-payment`).
12. Delivery payment status becomes `paid`.

---

## 5) Important Notes (Current Behavior)

- For `simpleOrder`, rider request is not a separate manual button. After owner accept, rider sees it in rider new orders automatically.
- Settings `Bank Detail` screen currently does not save input by itself; Stripe onboarding flow is handled through AddBank flow.
- Some list-order completion UX paths are lighter than simple-order flow, but payment + reached + delivery charge flow is active.

---

## 6) Useful API Map (Frontend Environment)

- Checkout create/verify: `cart/verify-payment`
- Shop new orders: `order/get-shop-orders`
- Shop accept/reject: `order/accept-reject-order-owner`
- Shop accepted (my orders): `order/get-shop-accepted-orders`
- Rider new orders: `order/get-rider-orders`
- Rider accept/reject simple order: `order/accept-reject-order-rider`
- Rider accepted (my orders): `order/get-rider-accepted-orders`
- Mark shop picked: `order/mark-shop-order-pickedup`
- Mark shop ready: `order/mark-shop-order-ready-for-pickup`
- Mark rider reached: `list/mark-rider-reached`
- Pay delivery charges: `list/pay-delivery-charges`
- Verify delivery payment: `list/verify-delivery-payment`
- Mark completed: `order/change-order-status`
- List create: `list/create-list`
- Request rider: `list/request-rider`
- List accept/reject: `list/accept-reject-list-order`
- List bill update: `list/buying-grocery`
- Send list bill: `list/send-list-bill`
- Verify list payment: `list/verify-payment`
