import { Message } from "@revolt/app";
import { useTranslation } from "@revolt/i18n";
import { scrollable, styled } from "@revolt/ui";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

scrollable;

/**
 * Modal to report content
 */
const ReportContent: PropGenerator<"report_content"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: "Tell us what's wrong with this message",
    },
    schema: {
      preview: "custom",
      category: "combo",
      detail: "text",
    },
    data: {
      preview: {
        element: (
          <ContentContainer use:scrollable>
            <Message message={props.target as never} />
          </ContentContainer>
        ),
      },
      category: {
        options: [{ name: "aaa", value: "aaa" }],
        field: "Pick a category",
      },
      detail: {
        field: "Give us some detail",
      },
    },
    callback: async ({ category, detail, preview }) => {
      // TODO: bot API in revolt.js
      /*const { bot } = await props.client.bots
        .create({ name })
        .catch(mapAnyError);*/
      // props.onCreate(bot);
    },
    submit: {
      children: "Report",
    },
  });
};

const ContentContainer = styled.div`
  max-width: 100%;
  max-height: 240px;

  > div {
    margin-top: 0 !important;
    pointer-events: none;
    user-select: none;
  }
`;

export default ReportContent;
