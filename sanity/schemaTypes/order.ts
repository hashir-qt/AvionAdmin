export default {
    name: "order",
    title: "Orders",
    type: "document",
    fields: [
      {
        name: "customerName",
        title: "Customer Name",
        type: "string",
      },
      {
        name: "address",
        title: "Address",
        type: "string",
      },
      {
        name: "orderId",
        title: "Order ID",
        type: "string",
      },
      {
        name: "city",
        title: "City",
        type: "string",
      },
      {
        name: "postalCode",
        title: "Postal Code",
        type: "string",
      },
      {
        name: "country",
        title: "Country",
        type: "string",
      },
      {
        name: "cardNumber",
        title: "Card Number (Last 4 digits)",
        type: "string",
      },
      {
        name: "totalPrice",
        title: "Total Price",
        type: "number",
      },
      {
        name: "items",
        title: "Items",
        type: "array",
        of: [{ type: "reference", to: [{ type: "product" }] }],
      },
      {
        name: "status",
        title: "Order Status",
        type: "string",
        options: {
          list: ["Pending", "Processing", "Shipped", "Delivered"],
        },
        initialValue: "Pending",
      },
      {
        name: "createdAt",
        title: "Created At",
        type: "datetime",
      },
    ],
  };
  