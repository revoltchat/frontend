import { Button, CategoryButton, Header, styled, Column, Typography } from "@revolt/ui";
import { IS_DEV, IS_REVOLT, useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { useNavigate } from "@revolt/routing";

import { Match, Switch } from "solid-js";

import { BiRegularMoney, BiSolidCompass, BiSolidCog, BiSolidMegaphone, BiSolidPlusCircle, BiSolidRightArrowCircle } from "solid-icons/bi";
import { modalController } from "@revolt/modal";

/**
 * Base layout of the home page (i.e. the header/background)
 */
const Base = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme!.colours["background-200"]};
`;

/**
 * Layout of the content as a whole
 */
const Content = styled("div")`
  width: fit-content;
  margin: auto;
`

/**
 * Layout of the buttons
 */
const Buttons = styled("div")`
  display: flex;
`;

/**
 * Make sure the columns are separated 
 */
const SeparatedColumn = styled(Column)`
  margin-inline: 0.25em;
`;

/**
 * Make sure the image is separated from the welcome text
 */
const Image = styled("img")`
  margin-top: 0.5em;
  height: 80px;
`

export function HomePage() {
    const t = useTranslation();
    const navigate = useNavigate();
    const client = useClient();
    // check if we're revolt.chat; if so, check if the user is in the Lounge
    const showLoungeButton = IS_REVOLT;
    const isInLounge = client.servers.get("01F7ZSBSFHQ8TA81725KQCSDDP") !== undefined;

    return (
        <Base>
            <Header palette="primary">Home</Header>
            <Content>
                <Typography
                    style={"text-align: center; margin-bottom: 1em; font-size: 200%;"}
                    variant="legacy-settings-title">
                    {t("app.special.modals.onboarding.welcome")}
                    <br />
                    <Image src="/assets/wide.svg" />
                </Typography>
                <Buttons>
                    <SeparatedColumn>
                        <CategoryButton
                            onClick={() => modalController.push({ type: "create_group", client })}
                            description={t("app.home.group_desc")}
                            icon={<BiSolidPlusCircle size={24} />}>
                            {t("app.home.group")}
                        </CategoryButton>
                        <Switch fallback={null}>
                            <Match when={showLoungeButton && isInLounge}>
                                <CategoryButton
                                    onClick={() => navigate("/server/01F7ZSBSFHQ8TA81725KQCSDDP")}
                                    description={t("app.home.goto-testers_desc")}
                                    icon={<BiSolidRightArrowCircle size={24} />}>
                                    {t("app.home.goto-testers")}
                                </CategoryButton>
                            </Match>
                            <Match when={showLoungeButton && !isInLounge}>
                                <CategoryButton
                                    description={t("app.home.join-testers_desc")}
                                    icon={<BiSolidRightArrowCircle size={24} />}>
                                    {t("app.home.join-testers")}
                                </CategoryButton>
                            </Match>
                        </Switch>
                        <CategoryButton
                            onClick={() => window.open("https://insrt.uk/donate?utm_source=revoltapp")}
                            description={t("app.home.donate_desc")}
                            icon={<BiRegularMoney size={24} />}>
                            {t("app.home.donate")}
                        </CategoryButton>
                    </SeparatedColumn>
                    <SeparatedColumn>
                        <Switch fallback={null}>
                            <Match when={IS_REVOLT}>
                                <CategoryButton
                                    onClick={() => navigate("/discover")}
                                    description={t("app.home.discover_desc")}
                                    icon={<BiSolidCompass size={24} />}>
                                    {t("app.home.discover")}
                                </CategoryButton>
                            </Match>
                        </Switch>
                        <CategoryButton description={t("app.home.feedback_desc")} icon={<BiSolidMegaphone size={24} />}>{t("app.home.feedback")}</CategoryButton>
                        <CategoryButton description={t("app.home.settings-tooltip")} icon={<BiSolidCog size={24} />}>{t("app.home.settings")}</CategoryButton>
                    </SeparatedColumn>
                </Buttons>
                <Switch fallback={null}>
                    <Match when={IS_DEV}>
                        <Button style={"margin: auto;"} onClick={() => navigate("/dev")}>Open Development Page</Button>
                    </Match>
                </Switch>
            </Content>
        </Base>
    );
};