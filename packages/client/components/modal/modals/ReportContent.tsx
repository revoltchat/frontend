import { API, Server, User } from "revolt.js";

import { Message } from "@revolt/app";
import { useTranslation } from "@revolt/i18n";
import { Avatar, Column, Initials } from "@revolt/ui";
import { styled } from "styled-system/jsx";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";
import { cva } from "styled-system/css";

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
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: `Tell us what's wrong with this ${
        /* TEMP TODO */ props.target instanceof User
          ? "user"
          : props.target instanceof Server
          ? "server"
          : "message"
      }`,
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
            name: "Please select a reason",
            value: "",
            disabled: true,
            selected: true,
          },
          ...(props.target instanceof User
            ? USER_REPORT_REASONS
            : CONTENT_REPORT_REASONS
          ).map((value) => ({
            name: t(
              `app.special.modals.report.content_reason.${value}` as any,
              {},
              value
            ),
            value,
          })),
        ],
        field: "Pick a category",
      },
      detail: {
        field: "Give us some detail",
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
      children: "Report",
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
