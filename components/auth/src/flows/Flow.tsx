import { styled } from "solid-styled-components";

export const FlowBase = styled("div")`
  background-color: rgba(36, 36, 36, 0.75);
  border: 2px solid rgba(128, 128, 128, 0.15);
  backdrop-filter: blur(20px);

  max-width: 360px;
  max-height: 600px;
  padding: 30px 25px;
  border-radius: 8px;

  margin-top: 20px;
  margin-bottom: 20px;
  margin-inline-start: 50px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
`;
