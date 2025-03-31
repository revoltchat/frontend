import { Match, Switch } from "solid-js";

import { Trans, useLingui } from "@lingui-solid/solid/macro";
import { API, Server, User } from "revolt.js";
import { cva } from "styled-system/css";

import { Message } from "@revolt/app";
import { Avatar, Column, Initials } from "@revolt/ui";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

const CONTENT_REPORT_REASONS: API.ContentReportReason[] = [
  "Illegal",
  "IllegalGoods",
  "IllegalExtortion",
  "IllegalPornography",
  "IllegalHacking",
  "ExtremeViolence",
  "PromotesHarm",
  "UnsolicitedSpam",
  "Raid",
  "SpamAbuse",
  "ScamsFraud",
  "Malware",
  "Harassment",
  "NoneSpecified",
];

const USER_REPORT_REASONS: API.UserReportReason[] = [
  "UnsolicitedSpam",
  "SpamAbuse",
  "InappropriateProfile",
  "Impersonation",
  "BanEvasion",
  "Underage",
  "NoneSpecified",
];

/**
 * Modal to report content
 */
const ReportContent: PropGenerator<"report_content"> = (props) => {
  const { t } = useLingui();

  const strings: Record<
    API.ContentReportReason | API.UserReportReason,
    string
  > = {
    Illegal: t`Content breaks one or more laws`,
    IllegalGoods: t`Drugs or illegal goods`,
    IllegalExtortion: t`Extortion or blackmail`,
    IllegalPornography: t`Revenge or underage pornography`,
    IllegalHacking: t`Illegal hacking or cracking`,
    ExtremeViolence: t`Extreme violence, gore or animal cruelty`,
    PromotesHarm: t`Promotes harm`,
    UnsolicitedSpam: t`Unsolicited advertising or spam`,
    Raid: t`Raid or spam attack`,
    SpamAbuse: t`Spam or similar platform abuse`,
    ScamsFraud: t`Scams or fraud`,
    Malware: t`Malware or phishing`,
    Harassment: t`Harassment or cyberbullying`,
    NoneSpecified: t`Other`,

    InappropriateProfile: t`User's profile has inappropriate content`,
    Impersonation: t`Impersonation`,
    BanEvasion: t`Ban evasion`,
    Underage: t`Not of minimum age to use the platform`,
  };

  return createFormModal({
    modalProps: {
      title: (
        <Switch>
          <Match when={props.target instanceof User}>
            <Trans>Tell us what's wrong with this user</Trans>
          </Match>
          <Match when={props.target instanceof Server}>
            <Trans>Tell us what's wrong with this server</Trans>
          </Match>
          <Match when={props.target instanceof Message}>
            <Trans>Tell us what's wrong with this message</Trans>
          </Match>
        </Switch>
      ),
    },
    schema: {
      preview: "custom",
      category: "combo",
      detail: "text",
    },
    data: {
      preview: {
        element: (
          <div class={contentContainer()} use:scrollable>
            {props.target instanceof User ? (
              <Column align>
                <Avatar src={props.target.animatedAvatarURL} size={64} />
                {props.target.displayName}
              </Column>
            ) : props.target instanceof Server ? (
              <Column align>
                <Avatar
                  src={props.target.animatedIconURL}
                  fallback={<Initials input={props.target.name} />}
                  size={64}
                />
                {props.target.name}
              </Column>
            ) : (
              <Message message={props.target as never} />
            )}
          </div>
        ),
      },
      category: {
        options: [
          {
            name: <Trans>Please select a reason</Trans>,
            value: "",
            disabled: true,
            selected: true,
          },
          ...(props.target instanceof User
            ? USER_REPORT_REASONS
            : CONTENT_REPORT_REASONS
          ).map((value) => ({
            name: strings[value],
            value,
          })),
        ],
        field: <Trans>Pick a category</Trans>,
      },
      detail: {
        field: <Trans>Give us some detail</Trans>,
      },
    },
    callback: async ({ category, detail }) => {
      if (!category || (category === "NoneSpecified" && !detail))
        throw "NoReasonProvided";

      await props.client.api.post("/safety/report", {
        content:
          props.target instanceof User
            ? {
                type: "User",
                id: props.target.id,
                report_reason: category as API.UserReportReason,
                message_id: props.contextMessage?.id,
              }
            : props.target instanceof Server
              ? {
                  type: "Server",
                  id: props.target.id,
                  report_reason: category as API.ContentReportReason,
                }
              : {
                  type: "Message",
                  id: props.target.id,
                  report_reason: category as API.ContentReportReason,
                },
        additional_context: detail,
      });
    },
    submit: {
      children: <Trans>Report</Trans>,
    },
  });
};

const contentContainer = cva({
  base: {
    maxWidth: "100%",
    maxHeight: "240px",
    "& > div": {
      marginTop: "0 !important",
      pointerEvents: "none",
      userSelect: "none",
    },
  },
});

export default ReportContent;
