// schemas/product.ts

export const  product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string', // you can also use 'number' if you want pure price value
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string', // You can change this to a dropdown using "options"
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string', // You can change this to a dropdown using "options"
    },

  ],
}
