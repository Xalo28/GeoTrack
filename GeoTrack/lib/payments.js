import { useState, useEffect } from "react";
import Purchases from "react-native-purchases";

export const initializePayments = async (apiKey) => {
  await Purchases.configure({
    apiKey,
  });
};

export const usePackages = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const offerings = await Purchases.getOfferings();
        setPackages(offerings.current?.availablePackages ?? []);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const purchasePackage = async (pkg) => {
    try {
      setIsPurchasing(true);
      const { customerInfo, productIdentifier } = await Purchases.purchasePackage(pkg);
      
      return {
        success: true,
        customerInfo,
        productIdentifier
      };
    } catch (error) {
      console.error("Error purchasing package:", error);

      if (error.userCancelled) {
        return {
          success: false,
          cancelled: true,
          error: "Compra cancelada"
        };
      }

      return {
        success: false,
        error: error.message || "Error al procesar la compra"
      };
    } finally {
      setIsPurchasing(false);
    }
  };

  return { packages, isLoading, isPurchasing, purchase: purchasePackage };
};

export const useCustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        setIsLoading(true);
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
      } catch (error) {
        console.error("Error fetching customer info:", error);
        // En caso de error (ej: API key inválida), establecer customerInfo vacío
        // para que la UI no se rompa
        setCustomerInfo({ 
          entitlements: { active: {} }, 
          allPurchaseDates: {},
          originalAppUserId: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerInfo();

    const customerInfoUpdated = (info) => {
      setCustomerInfo(info);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, []);

  const hasActiveEntitlement = (entitlementId) => {
    return !!customerInfo?.entitlements.active[entitlementId];
  };

  return {
    customerInfo,
    isLoading,
    hasActiveEntitlement,
  };
};

