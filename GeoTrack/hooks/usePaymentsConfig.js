import { createContext, useContext } from "react";

export const PaymentsContext = createContext({
  isConfigured: false,
});

export const usePaymentsConfig = () => useContext(PaymentsContext);

