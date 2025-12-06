import { useEffect, useState } from "react";
import {
  ErrorCode,
  Purchases,
} from "@revenuecat/purchases-js";
import { usePaymentsConfig } from "../hooks/usePaymentsConfig";

export const initializePayments = async (apiKey) => {
  const appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
  Purchases.configure(apiKey, appUserId);
};

export const offeringId = "default";

export const webReset = () => {
  ["html", "body"].forEach(tag => {
    document.querySelector(tag)?.removeAttribute("style");
  });
};

export const usePackages = () => {
  const { isConfigured } = usePaymentsConfig();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;

    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const offerings = await Purchases.getSharedInstance().getOfferings();
        setPackages(offerings.all[offeringId]?.availablePackages || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [isConfigured]);

  const purchase = async (pkg) => {
    try {
      setIsPurchasing(true);
      const { customerInfo } = await Purchases.getSharedInstance().purchase({ rcPackage: pkg });
      return {
        success: true,
        customerInfo
      };
    } catch (e) {
      if (e.code === ErrorCode.UserCancelledError) {
        return {
          success: false,
          cancelled: true,
          error: "Compra cancelada"
        };
      }
      return {
        success: false,
        error: e.message || "Error al procesar la compra"
      };
    } finally {
      setIsPurchasing(false);
      webReset();
    }
  };

  return { packages, isLoading, isPurchasing, purchase };
};

export const useCustomerInfo = () => {
  const { isConfigured } = usePaymentsConfig();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) return;

    const fetchCustomerInfo = async () => {
      try {
        setIsLoading(true);
        const info = await Purchases.getSharedInstance().getCustomerInfo();
        setCustomerInfo(info);
      } catch (e) {
        console.error("Failed to fetch customer info", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomerInfo();
  }, [isConfigured]);

  const hasActiveEntitlement = (entitlementId) => {
    return !!customerInfo?.entitlements.active[entitlementId];
  };

  return { customerInfo, isLoading, hasActiveEntitlement };
};

