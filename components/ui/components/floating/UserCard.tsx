import { useFloating } from "solid-floating-ui";
import { For, JSX, Ref, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { ThemeProvider, styled } from "solid-styled-components";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { Motion, Presence } from "@motionone/solid";
import { ServerMember, User } from "revolt.js";

import { ColouredText } from "../design";

/**
 * Base element for the card
 */
const Base = styled("div", "Tooltip")`
  color: white;
  background: black;
  width: 400px;
  height: 400px;
  background: ${({ theme }) => theme!.colours["background-300"]};
`;

const ProfilePictureContainer = styled.div`
  position: relative;
  width: 85px;
  height: 85px;
`;

const profiletopcontainerStyle = {
  position: 'relative',
  width: '100%',
  height: '350px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  marginBottom: '20px'
};



const profileimageStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-220%, -150%)',
  "border-radius": '50%',
  width: '85px',
  height: '85px',
  "object-fit": 'cover',
  overflow: 'hidden',
  zIndex: '1',
};

const StatusIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white
`;

const GrayOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background-color: rgba(0, 0, 0, 0.5);
`;
//{'border-radius': '50%', width: '85px', height: '85px', "object-fit": "cover", overflow: "hidden"}
interface Props {
  /**
   * User card trigger area
   * @param triggerProps Props that need to be applied to the trigger area
   */
  children: (triggerProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: Ref<any>;
    onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
  }) => JSX.Element;

  /**
   * Initial show state (used for debugging)
   */
  initialState?: boolean;

  /**
   * User to show
   */
  user: User;

  /**
   * Member to show
   */
  member?: ServerMember;
}

/**
 * UserCard component
 */
export function UserCard(props: Props) {
  const [anchor, setAnchor] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLDivElement>();
  const [show, setShow] = createSignal(props.initialState ?? false);

  const position = useFloating(anchor, floating, {
    placement: "right-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  return (
    <>
      {props.children({
        ref: setAnchor,
        onClick: () => setShow(!show()),
      })}
      <Portal mount={document.getElementById("floating")!}>
        <Presence>
          <Show when={show()}>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, easing: [0.87, 0, 0.13, 1] }}
            >
              <Base
                ref={setFloating}
                style={{
                  position: position.strategy,
                  top: `${position.y ?? 0}px`,
                  left: `${position.x ?? 0}px`,
                  'border-radius': '3%',
                  overflow: "hidden"
                }}
                role="tooltip">
                <div style={profiletopcontainerStyle}>
                  <div style={{width: '100%', height: '30%', overflow: "hidden"}}>
                    <img src={props.user.animatedAvatarURL} style={{ width: '100%', height: '100%'}} ></img>
                    <GrayOverlay style={{width:'100%', height: '30%'}} />
                  </div>
                  
                  
                  <img src={props.user.animatedAvatarURL} style={profileimageStyle}></img>
                  <StatusIndicator style={{"background-color": "#ffffff", transform: 'translate(-1540%, -1100%)'}}/>
                  <h2 style={{transform: 'translate(3.5%, 30%)'}}>@{props.user.username}</h2>
                  {props.member?.nickname ? <p style={{"padding-left": "9%", "padding-top": "0.5%", margin: "0px", transform: 'translate(0%, -60%)'}}>AKA: {props.member?.nickname}</p> : null}
            
                  ID: {props.user.id}<br />Badges: {props.user.badges}<br />Status: {props.user.status?.presence}<br />Flags?: {props.user.flags} <br /> Privalledge???: {props.user.privileged} <br /> created at: {props.user.fetchProfile()} <br /> {props.user.relationship} <br /> {props.user.permission}
                  <br />
                </div>

                <Show when={props.member}>
                  <For each={props.member!.orderedRoles}>
                    {(role) => (
                      <div>
                        <ColouredText
                          colour={role.colour!}
                          clip={role.colour?.includes("gradient")}
                        >
                          {role.name}
                        </ColouredText>
                      </div>
                    )}
                  </For>
                </Show>
              </Base>
            </Motion>
          </Show>
        </Presence>
      </Portal>
    </>
  );
}
