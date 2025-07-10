// #--------------------------------------------add to card product manage-------------------------------------------------------------

// #----------------------# is main add to card waly product add hoye ga --------------------------------------------
// is ko meny order page or Navbar component main dia hai
export async function ReadData(email: string) {
  const base = process.env.NEXT_PUBLIC_ADDTOCARDAPI;
  if (base) {
    try {
      const reponse = await fetch(`${base}/read_product?email=${email}`, {
        method: "GET",
        cache: "no-cache",
      });
      const convert = await reponse.json();
      return convert;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Your api key is none");
  }
}

// #----------------is main add to card waly product read hoye gy --------------------------
// is ko meny danamic productDetailPage page main or ProductCard component main dia hai

export interface ProductDataSchema {
  email?: string;
  productId?: string;
  category?: string;
  description?: string;
  image?: string;
  name?: string;
  price?: number;
  quantity?: number;
  type?: string;
}

export async function PustData(data: ProductDataSchema) {
  const base = process.env.NEXT_PUBLIC_ADDTOCARDAPI;
  if (base) {
    try {
      const reponse = await fetch(`${base}/addProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const convert = await reponse.json();
      console.log(convert);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Your api key is none");
  }
}

//-------------is main add to card wala main sy ek product delete hoye gy-------------------------
// is ko meny order waly page main dia hai

export interface ProductDeleetSchema {
  email: string;
  index_number: number;
}
export async function DeleteData(data: ProductDeleetSchema) {
  const base = process.env.NEXT_PUBLIC_ADDTOCARDAPI;
  if (base) {
    try {
      const reponse = await fetch(`${base}/delect_product`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const convert = await reponse.json();
      console.log(convert);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Your api key is none");
  }
}

// -------------------------------------jab user form fill kardy ga to sara add to card data order waly main save ho jaye ga or add to card waly main sy sary product delete ho jaye ga----
// is ko emny OrderForm waly component main dia hai

export async function DeleteAddToCard(email: string) {
  const base = process.env.NEXT_PUBLIC_ADDTOCARDAPI;
  if (base) {
    try {
      const reponse = await fetch(`${base}/delete_add_to_card?email=${email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const convert = await reponse.json();
      console.log(convert);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Your api key is none");
  }
}

// #---------------------------------------------is main order backend main database main save ho raha hai-------------------------------------------------------------------
// #-----------------is main order add ho rahy hai---------------------

// is ko meny OrderFfrom waly component main dia hai
export interface OrderDataStructure {
  orderId: string;
  loginEmail: string;
  orderDate: string;
  orderStatus: boolean;
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryNotes?: string;
  paymentMethod: string;
  totalAmount: number;
  addToCartProduct: ProductDataSchema[];
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

export async function PustOrderData(data: OrderDataStructure) {
  const base = process.env.NEXT_PUBLIC_ADDTOCARDAPI;
  if (base) {
    try {
      const reponse = await fetch(`${base}/addOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const convert: ApiResponse = await reponse.json();
      return convert;
    } catch (error) {
      console.log(error);
      return { message: `${error}`, success: false };
    }
  } else {
    return { message: "Your api key is none", success: false };
  }
}

// ---------------------------------------ia main ai ka response araha hai backend main sy------------------------------------------------------------

// is ko meny ChatBot component main dia  hai
type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

export async function AiAssistant(
  prompt: Message[],
  user_email: string
): Promise<string> {
  // is main latset maly object ky andar user ki email add kar raha ho
  const updatedPrompt: Message[] = prompt.map((msg, idx) => {
    if (idx === prompt.length - 1) {
      return {
        ...msg,
        content: `${msg.content} user email: ${user_email}`,
      };
    }
    return { ...msg };
  });

  // console.log(prompt)
  const base = process.env.NEXT_PUBLIC_ADDTOCARDAPI;
  if (base) {
    try {
      const reponse = await fetch(`${base}/ai_assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPrompt),
      });
      const convert = await reponse.json();
      return convert;
    } catch (error) {
      console.log(error);
      return `${error}`;
    }
  } else {
    return "Our chat service is currently unavailable. Please try again later.";
  }
}

// -----------------------------------------is main user ki Complaint jarahe hai--------------------------------------------------------

// is ko meny contact waly page main dia hai
export interface UserComplaintSchema {
  name: string;
  email: string;
  phone_number: string;
  message: string;
}

export async function UserComplaint(data: UserComplaintSchema) {
  const base = process.env.NEXT_PUBLIC_ADDTOCARDAPI;
  if (base) {
    try {
      const reponse = await fetch(`${base}/user_complaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const convert: ApiResponse = await reponse.json();
      return convert;
    } catch (error) {
      console.log(error);
      return { message: `${error}`, success: false };
    }
  } else {
    return { message: "Your api key is none", success: false };
  }
}
