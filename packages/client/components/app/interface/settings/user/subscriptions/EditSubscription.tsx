import {
  EditSubscriptionJoinFlow,
  TempMountStripe,
} from "./EditSubscriptionJoinFlow";

/**
 * Settings menu for joining or changing [premium subscription name here]
 */
export function EditSubscription() {
  return (
    <TempMountStripe>
      <EditSubscriptionJoinFlow />
    </TempMountStripe>
  );
}
