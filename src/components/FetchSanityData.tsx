//  is meny ProductCard component, [product_setail], bakery, snacks or daliy main dia hai 

import { client } from "@/sanity/lib/client";

// image ka interface
interface SanityImageAsset {
  _ref: string;
  _type: "reference";
}

// image ka interface
interface SanityImage {
  _type: "image";
  asset: SanityImageAsset;
}

// ye sanity ka data interface hai
export interface Product {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  category: string;
  description: string;
  image: SanityImage;
  name: string;
  price: string;
  type: string;
}

// is main sanity ka data fetch ho raha hai id ya type ky zayeye
export default async function FetchSanityData(type?: string, id?: string) {
  if (type) {
    const query = `*[_type == "product" && type == "${type}"]`; // is main type ky zayeye sanity ka data fetch ho raha hai jasy bakery, dairy, and snack ye data is main fetch ho raha hai
    try {
      const data: Product[] = await client.fetch(query);
      return data;
    } catch (error) {
      return `❌ Error fetching Sanity data: ${error}`;
    }
  } else if (id) {
    const query = `*[_type == "product" && _id == "${id}"]`; // is main single product ka data fetch ho raha hai product id ky zayeye id ky zayeye
    try {
      const data: Product[] = await client.fetch(query);
      return data;
    } catch (error) {
      return `❌ Error fetching Sanity data: ${error}`;
    }
  } else {
    return "❌ Error fetching Sanity data:";
  }
}
