import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginRequest!) {
    loginUser(input: $input) {
      token
    }
  }
`;

export const GET_ALL_USERS = gql`
  query getAllUsers {
    users{
        user_id
        name
        email
    }
  
}
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: NewUser!) {  
    createUser(input: $input) {
      name
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUser!) {
    updateUser(id: $id, input: $input) {
      user_id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) 
  }
`;


export const GET_ALL_PRODUCTS = gql`
  query getAllProducts {
    products {
        product_id
        product_name
        product_price
        product_stock
    }
  
}
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: NewProduct!) {  
    createProduct(input: $input) {
      product_name
      product_price
      product_stock
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: NewProduct!) {
    updateProduct(id: $id, input: $input)
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) 
  }
`;