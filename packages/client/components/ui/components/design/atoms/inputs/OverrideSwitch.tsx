import { BiRegularCheck, BiRegularX } from "solid-icons/bi";

import { styled } from "styled-system/jsx";

import { Ripple } from "@revolt/ui";

type State = "allow" | "neutral" | "deny";

interface Props {
  readonly value: State;
  readonly disabled?: boolean;
  readonly onChange: (state: State) => void;
}

/**
 * Override Switch
 */
export function OverrideSwitch(props: Props) {
  return (
    <SwitchContainer
      role="radiogroup"
      aria-orientiation="horizontal"
      aria-disabled={props.disabled}
    >
      <Switch
        type="allow"
        selected={props.value}
        onClick={() => !props.disabled && props.onChange("allow")}
        role="radio"
      >
        <Ripple />
        <BiRegularCheck size={24} />
      </Switch>
      <Switch
        type="neutral"
        selected={props.value}
        onClick={() => !props.disabled && props.onChange("neutral")}
        role="radio"
      >
        <Ripple />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          width="24"
          viewBox="0 96 960 960"
        >
          <path d="M120 936v-60h60v60h-60Zm0-148v-83h60v83h-60Zm0-171v-83h60v83h-60Zm0-170v-83h60v83h-60Zm0-171v-60h60v60h-60Zm148 660v-60h83v60h-83Zm0-660v-60h83v60h-83Zm171 660v-60h83v60h-83Zm0-660v-60h83v60h-83Zm170 660v-60h83v60h-83Zm0-660v-60h83v60h-83Zm171 660v-60h60v60h-60Zm0-148v-83h60v83h-60Zm0-171v-83h60v83h-60Zm0-170v-83h60v83h-60Zm0-171v-60h60v60h-60Z" />
        </svg>
      </Switch>
      <Switch
        type="deny"
        selected={props.value}
        onClick={() => !props.disabled && props.onChange("deny")}
        role="radio"
      >
        <Ripple />
        <BiRegularX size={24} />
      </Switch>
    </SwitchContainer>
  );
}

const SwitchContainer = styled("div", {
  base: {
    flexShrink: 0,
    width: "fit-content",
    // height: 'fit-content',

    display: "flex",
    margin: "4px 0",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-md)",

    // "&[aria-disabled]": {
    //   pointerEvents: "none",
    //   opacity: 0.6,
    // },

    transition: "var(--transitions-fast) all",
    background: "var(--md-sys-color-primary-container)",
  },
});

const Switch = styled("div", {
  base: {
    // for <Ripple />:
    position: "relative",
    
    padding: "4px",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    transition: "var(--transitions-fast) all",

    "&:hover": {
      // filter: "brightness(0.8)",
    },

    "& svg": {
      stroke: "5px solid red",
    },
  },
  variants: {
    selected: {
      allow: {},
      neutral: {},
      deny: {},
    },
    type: {
      allow: {},
      neutral: {},
      deny: {},
    },
  },
  compoundVariants: [
    {
      type: "allow",
      selected: "allow",
      css: {
        color: "var(--customColours-success-onColor)",
        background: "var(--customColours-success-color)",
      },
    },
    {
      type: "neutral",
      selected: "neutral",
      css: {
        fill: "var(--md-sys-color-inverse-on-surface)",
        background: "var(--md-sys-color-inverse-surface)",
      },
    },
    {
      type: "deny",
      selected: "deny",
      css: {
        color: "var(--md-sys-color-on-error)",
        background: "var(--md-sys-color-error)",
      },
    },
  ],
});
