// PayPal Integration for TrueNorthUGC
// Based on blueprint:javascript_paypal
import * as PayPal from "@paypal/paypal-server-sdk";
import { Request, Response } from "express";

const { Client, Environment, LogLevel, OAuthAuthorizationController, OrdersController } = PayPal as any;

/* PayPal Controllers Setup */

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

export function isPayPalConfigured(): boolean {
  return !!(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);
}

let client: any = null;
let ordersController: any = null;
let oAuthAuthorizationController: any = null;

function initializePayPal() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal is not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET secrets.");
  }
  
  if (!client) {
    client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_CLIENT_SECRET,
      },
      timeout: 0,
      environment:
        process.env.NODE_ENV === "production"
          ? Environment.Production
          : Environment.Sandbox,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: {
          logBody: true,
        },
        logResponse: {
          logHeaders: true,
        },
      },
    });
    ordersController = new OrdersController(client);
    oAuthAuthorizationController = new OAuthAuthorizationController(client);
  }
}

/* Token generation helpers */

export async function getClientToken() {
  initializePayPal();
  
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController!.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

// Platform fee configuration
const PLATFORM_FEE_PERCENTAGE = 0.20; // 20% platform fee

export function calculateFees(totalAmount: number): { platformFee: number; creatorPayout: number } {
  const platformFee = Math.round(totalAmount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
  const creatorPayout = Math.round((totalAmount - platformFee) * 100) / 100;
  return { platformFee, creatorPayout };
}

/*  Process transactions */

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    initializePayPal();
    
    const { amount, currency, intent, recipientUserId, description } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount. Amount must be a positive number.",
      });
    }

    if (!currency) {
      return res.status(400).json({ error: "Invalid currency. Currency is required." });
    }

    if (!intent) {
      return res.status(400).json({ error: "Invalid intent. Intent is required." });
    }

    // Calculate the 20% platform fee
    const totalAmount = parseFloat(amount);
    const { platformFee, creatorPayout } = calculateFees(totalAmount);

    const collect = {
      body: {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
              breakdown: {
                itemTotal: {
                  currencyCode: currency,
                  value: amount,
                },
              },
            },
            items: [
              {
                name: description || "Creator Service Payment",
                quantity: "1",
                unitAmount: {
                  currencyCode: currency,
                  value: amount,
                },
              },
            ],
            description: `Creator payment: $${creatorPayout} to creator, $${platformFee} platform fee (20%)`,
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController!.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    // Include fee breakdown in response
    res.status(httpStatusCode).json({
      ...jsonResponse,
      feeBreakdown: {
        totalAmount: amount,
        platformFee: platformFee.toFixed(2),
        creatorPayout: creatorPayout.toFixed(2),
        platformFeePercentage: "20%",
      },
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    initializePayPal();
    
    const orderIDParam = req.params.orderID;
    const orderID = Array.isArray(orderIDParam) ? orderIDParam[0] : orderIDParam;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController!.captureOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  try {
    const clientToken = await getClientToken();
    res.json({ clientToken });
  } catch (error) {
    console.error("Failed to load PayPal:", error);
    res.status(500).json({ error: "PayPal is not configured." });
  }
}
