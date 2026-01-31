import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "paypal-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface PaymentButtonProps {
  creatorUserId: string;
  creatorName: string;
  amount: number;
  description?: string;
  onSuccess?: (transaction: any) => void;
  onError?: (error: any) => void;
  disabled?: boolean;
  buttonText?: string;
}

export default function PaymentButton({
  creatorUserId,
  creatorName,
  amount,
  description = "Creator service payment",
  onSuccess,
  onError,
  disabled = false,
  buttonText = "Pay Creator",
}: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalConfigured, setPaypalConfigured] = useState(false);
  const { toast } = useToast();

  const platformFee = Math.round(amount * 0.20 * 100) / 100;
  const creatorPayout = Math.round((amount - platformFee) * 100) / 100;

  useEffect(() => {
    const checkPayPalConfig = async () => {
      try {
        const res = await fetch("/paypal/setup");
        const data = await res.json();
        setPaypalConfigured(!!data.clientToken);
      } catch {
        setPaypalConfigured(false);
      }
    };
    checkPayPalConfig();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    const loadPayPalSDK = async () => {
      try {
        if (!(window as any).paypal) {
          const script = document.createElement("script");
          script.src = import.meta.env.PROD
            ? "https://www.paypal.com/web-sdk/v6/core"
            : "https://www.sandbox.paypal.com/web-sdk/v6/core";
          script.async = true;
          script.onload = () => initPayPal();
          document.body.appendChild(script);
        } else {
          await initPayPal();
        }
      } catch (e) {
        console.error("Failed to load PayPal SDK", e);
      }
    };

    loadPayPalSDK();
  }, [isOpen]);

  const createOrder = async () => {
    const orderPayload = {
      amount: amount.toFixed(2),
      currency: "CAD",
      intent: "CAPTURE",
      recipientUserId: creatorUserId,
      description,
    };
    const response = await fetch("/paypal/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    const output = await response.json();
    return { orderId: output.id };
  };

  const captureOrder = async (orderId: string) => {
    const response = await fetch(`/paypal/order/${orderId}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { data, orderId };
  };

  const recordTransaction = async (orderId: string) => {
    const response = await apiRequest("POST", "/api/transactions", {
      paypalOrderId: orderId,
      recipientUserId: creatorUserId,
      amount: amount.toFixed(2),
      currency: "CAD",
      description,
    });
    return await response.json();
  };

  const onApprove = async (data: any) => {
    setIsProcessing(true);
    setPaymentStatus("processing");
    try {
      const result = await captureOrder(data.orderId);
      const transaction = await recordTransaction(data.orderId);
      
      setPaymentStatus("success");
      toast({
        title: "Payment Successful",
        description: `You paid $${amount.toFixed(2)} CAD to ${creatorName}`,
      });
      
      if (onSuccess) {
        onSuccess(transaction);
      }
      
      setTimeout(() => {
        setIsOpen(false);
        setPaymentStatus("idle");
      }, 2000);
    } catch (error: any) {
      console.error("Payment capture failed:", error);
      setPaymentStatus("error");
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const onCancel = async () => {
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment.",
    });
  };

  const handleError = async (data: any) => {
    console.error("PayPal error:", data);
    setPaymentStatus("error");
    toast({
      title: "Payment Error",
      description: "An error occurred with PayPal. Please try again.",
      variant: "destructive",
    });
  };

  const initPayPal = async () => {
    try {
      const clientToken: string = await fetch("/paypal/setup")
        .then((res) => res.json())
        .then((data) => data.clientToken);
        
      if (!clientToken) {
        console.error("PayPal not configured");
        return;
      }

      const sdkInstance = await (window as any).paypal.createInstance({
        clientToken,
        components: ["paypal-payments"],
      });

      const paypalCheckout = sdkInstance.createPayPalOneTimePaymentSession({
        onApprove,
        onCancel,
        onError: handleError,
      });

      const onClick = async () => {
        if (isProcessing) return;
        try {
          setIsProcessing(true);
          const checkoutOptionsPromise = createOrder();
          await paypalCheckout.start(
            { paymentFlow: "auto" },
            checkoutOptionsPromise,
          );
        } catch (e) {
          console.error(e);
          setIsProcessing(false);
        }
      };

      const paypalButton = document.getElementById("payment-paypal-button");
      if (paypalButton) {
        paypalButton.addEventListener("click", onClick);
      }
      
      setPaypalLoaded(true);

      return () => {
        if (paypalButton) {
          paypalButton.removeEventListener("click", onClick);
        }
      };
    } catch (e) {
      console.error("Failed to initialize PayPal:", e);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        disabled={disabled || !paypalConfigured}
        className="gap-2"
        data-testid="button-pay-creator"
      >
        <CreditCard className="h-4 w-4" />
        {buttonText}
      </Button>
      
      {!paypalConfigured && (
        <p className="text-xs text-muted-foreground mt-1">
          PayPal payments are being set up
        </p>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Pay {creatorName}
            </DialogTitle>
            <DialogDescription>
              Complete your payment securely via PayPal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{description}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-xl font-bold">${amount.toFixed(2)} CAD</span>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Creator receives</span>
                    <span className="text-foreground">${creatorPayout.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Platform fee (20%)</span>
                    <Badge variant="secondary" className="text-xs">${platformFee.toFixed(2)} CAD</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {paymentStatus === "success" ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="font-medium text-green-600">Payment Successful!</p>
              </div>
            ) : paymentStatus === "error" ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="font-medium text-destructive">Payment Failed</p>
                <Button variant="outline" onClick={() => setPaymentStatus("idle")}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                {isProcessing ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing payment...</span>
                  </div>
                ) : paypalLoaded ? (
                  <paypal-button 
                    id="payment-paypal-button" 
                    data-testid="paypal-button"
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading PayPal...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="text-xs text-muted-foreground text-center">
            Payments are securely processed by PayPal
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
