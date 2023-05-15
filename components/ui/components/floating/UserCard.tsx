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
  width: 400px;
  height: 400px;
  background: ${({ theme }) => theme!.colours["background-300"]};
`;

const Container = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
`;

const Dots = styled.svg`
  fill: white;
  width: 100%;
  height: 100%;
`;

const Dot = styled.circle`
  fill: currentColor;
`;


const profiletopcontainerStyle = {
  position: 'relative',
  width: '100%',
  height: '350px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  marginBottom: '20px'
};

function getStatusColor(status: string | null | undefined) {
  switch (status) {
    case "Online":
      return "#23a15a";
    case "Busy":
      return "#f03b43";
    case "Focus":
      return "#439af1";
    case "Idle":
      return "#f0b232";
    default:
      return "#80848e";
  }
}



const profileimageStyle = {
  position: 'absolute',
  top: '25%',
  left: '3%',
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
const canvas = document.createElement('canvas');
canvas.width = 200; // Replace with desired width
canvas.height = 200; // Replace with desired height
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#AAAAAA'; // Replace with desired gray color
ctx.fillRect(0, 0, canvas.width, canvas.height);

function fetchUserbackground(props) {
  new Promise((resolve, reject) => {
    // Make API call to fetch user profile
    const profile = props.user.fetchProfile();
    // If successful, resolve with the profile
    if (profile) {
      resolve(profile);
    } else {
      reject("Could not fetch user profile");
    }
  }).then((profile) => {
    console.log(profile)
    if (typeof profile.background !== 'undefined') {
      document.getElementById("userprofilebanner").src = "https://autumn.revolt.chat/backgrounds/" + profile.background._id + "?width=1000";
    } else {
      document.getElementById("userprofilebanner").src = canvas.toDataURL();
    }
  })
}


function fetchUserProfile(props) {
  new Promise((resolve, reject) => {
    // Make API call to fetch user profile
    const profile = props.user.fetchProfile();
    
    // If successful, resolve with the profile
    if (profile) {
      resolve(profile);
    } else {
      reject("Could not fetch user profile");
    }
  }).then((profile) => {document.getElementById("userdescription").textContent = profile.content})
}


const fetchprofile = async (props) => {
  let profile =  await props.user.fetchProfile()
  console.log(profile)
}

export function UserCard(props: Props) {
  const [anchor, setAnchor] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLDivElement>();
  const [show, setShow] = createSignal(props.initialState ?? false);
  //const  profile = props.user.fetchprofile()
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
                  <div style={{width: '100%', height: '40%'}}>
                    <img  style={{ width: '100%', height: '100%' }} id="userprofilebanner"></img>
                    {fetchUserbackground(props)}
                    <GrayOverlay style={{width:'100%', height: '40%'}} />
                    <Container style={{position: "absolute", top: "3%", right: "5%"}}>
                      <Dots viewBox="0 0 24 24">
                        <Dot cx="12" cy="12" r="2"></Dot>
                        <Dot cx="6" cy="12" r="2"></Dot>
                        <Dot cx="18" cy="12" r="2"></Dot>
                      </Dots>
                    </Container>
                    {props.member?.nickname ? <h2 style={{position: "absolute", top: "18%", bottom: "40%", left: "25%"}}>@{props.user.username}</h2> : <h2 style={{position: "absolute", top: "25%", bottom: "40%", left: "25%"}}>@{props.user.username}</h2>}
                    {props.member?.nickname ? <p style={{position: "absolute", top: "28%", bottom: "20%", left: "25%"}}>AKA: {props.member?.nickname}</p> : null}
                    <img src={props.user.animatedAvatarURL} style={profileimageStyle}></img>
                    <StatusIndicator style={{"background-color": getStatusColor(props.user.status?.presence), position: 'absolute', top: "42%", left: "19%"}}/>
                  </div>
                  
                  
                  
                  

                  <div style={{"background-color": "#000000", "border-radius": "10%", width: "95%", "min-height": "10%", "top-margin": "2%", "bottom-margin": "2%", position: "absolute", bottom: "39%", left: "2.5%"}}>
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
                  </div>
                  <div style={{"background-color": "#000000", "border-radius": "10%", width: "95%", "min-height": "10%", "top-margin": "2%", "bottom-margin": "2%", position: "absolute", left: "2.5%", top: "63.5%", "max-height": "47.5%"}}>
                  <p style={{color: "#ffffff"}} id="userdescription">Loading... {fetchUserProfile(props)}</p> 
                  </div>

                </div>

                
              </Base>
            </Motion>
          </Show>
        </Presence>
      </Portal>
    </>
  );
}
