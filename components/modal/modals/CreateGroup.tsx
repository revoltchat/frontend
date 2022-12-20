import { useTranslation } from "@revolt/i18n";
import { useNavigate } from "@revolt/routing";
import { mapAnyError } from "@revolt/client";
import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to create a new group channel
 */
const CreateGroup: PropGenerator<"create_group"> = (props) => {
  const t = useTranslation();
  const navigate = useNavigate();

  return createFormModal({
    modalProps: {
      title: t("app.main.groups.create"),
    },
    schema: {
      name: "text",
    },
    data: {
      name: {
        field: t("app.main.groups.name"),
      },
    },
    callback: async ({ name }) => {
      const group = await props.client.channels
        .createGroup({
          name,
          users: [],
        })
        .catch(mapAnyError);

      navigate(`/channel/${group._id}`);
    },
    submit: {
      children: t("app.special.modals.actions.create"),
    },
  });
};

export default CreateGroup;
