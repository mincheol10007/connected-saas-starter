import { Webhooks } from "@polar-sh/nextjs";

import { requireEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const POST = Webhooks({
  webhookSecret: requireEnv("POLAR_WEBHOOK_SECRET"),
  onOrderPaid: async (payload) => {
    const order = payload.data;
    const appInstanceId = String(order.metadata.app_instance_id ?? "");
    const userId = order.customer.externalId;

    if (
      appInstanceId !== requireEnv("APP_INSTANCE_ID") ||
      order.productId !== requireEnv("POLAR_PRODUCT_ID") ||
      !userId
    ) {
      return;
    }

    const admin = createAdminClient();
    const { error } = await admin.rpc("apply_polar_order_paid", {
      p_app_instance_id: appInstanceId,
      p_event_id: `order.paid:${order.id}`,
      p_order_id: order.id,
      p_user_id: userId,
    });

    if (error) {
      throw error;
    }
  },
});
