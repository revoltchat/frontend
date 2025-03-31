import { createSignal } from "solid-js";
import { QRCodeSVG } from "solid-qr-code";

import { Trans, useLingui } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { Column, TextField } from "@revolt/ui";

import { PropGenerator } from "../types";

/**
 * Wrapper element for the raw TOTP code
 */
const Code = styled("code", {
  base: {
    userSelect: "all",
  },
});

/**
 * Wrapper element for the QR code
 */
const Qr = styled("div", {
  base: {
    borderRadius: "4px",
    background: "white",
    width: "140px",
    height: "140px",
    display: "grid",
    placeItems: "center",
  },
});

/**
 * Modal to display QR code and secret key for MFA and accept the correct code
 */
const MFAEnableTOTP: PropGenerator<"mfa_enable_totp"> = (props) => {
  const [value, setValue] = createSignal("");
  const { t } = useLingui();

  /**
   * Generate OTP URI
   */
  const uri = () =>
    `otpauth://totp/Revolt:${props.identifier}?secret=${props.secret}&issuer=Revolt`;

  return {
    title: <Trans>Enable authenticator app</Trans>,
    description: (
      <Trans>
        Please scan or use the token below in your authenticator app.
      </Trans>
    ),
    actions: [
      {
        palette: "primary",
        children: <Trans>Continue</Trans>,
        onClick: () => {
          props.callback(value().trim().replace(/\s/g, ""));
          return true;
        },
        confirmation: true,
      },
      {
        palette: "plain",
        children: <Trans>Cancel</Trans>,
        onClick: () => {
          props.callback();
          return true;
        },
      },
    ],
    nonDismissable: true,
    children: (
      <>
        <Column align>
          <Qr>
            <QRCodeSVG
              value={uri()}
              backgroundColor="white"
              foregroundColor="black"
              level="medium"
              height={140}
              width={140}
              backgroundAlpha={1}
              foregroundAlpha={1}
            />
          </Qr>
          <Code>{props.secret}</Code>
        </Column>

        <TextField
          value={value()}
          label={t`Enter Code`}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </>
    ),
  };
};

export default MFAEnableTOTP;
