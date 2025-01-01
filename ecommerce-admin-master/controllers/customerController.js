import {
    getCustomers as getCustomersMiddleware,
    createCustomer as createCustomerMiddleware,
    updateCustomer as updateCustomerMiddleware,
    deleteCustomer as deleteCustomerMiddleware,
    getCustomerWithUser as getCustomerWithUserMiddleware,
  } from "@/middleware/customerMiddleware";
  
  export const getCustomers = async (req, res) => {
    await getCustomersMiddleware(req, res);
  };
  
  export const createCustomer = async (req, res) => {
    await createCustomerMiddleware(req, res);
  };
  
  export const updateCustomer = async (req, res) => {
    await updateCustomerMiddleware(req, res);
  };
  
  export const deleteCustomer = async (req, res) => {
    await deleteCustomerMiddleware(req, res);
  };
  
  export const getCustomerWithUser = async (req, res) => {
    await getCustomerWithUserMiddleware(req, res);
  };
  