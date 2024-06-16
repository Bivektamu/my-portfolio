import styled from "styled-components";

export const Cursor = styled.div`
  /* background: red; */
  width: 20px;
  height: 20px;
  top: -10px;
  left: -10px;
  border-radius: 100%;
  background: none;
  border: 2px solid #141313;
  position: fixed;
  pointer-events: none;
  z-index: 99;
  transform: translate(-50%, -50%);
  /* transform: scale(2) */
  transition: width 0.4s, height 0.4s, border 0.4s,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s;
  will-change: width, height, border;
  &.hide {
    opacity: 0;
  }

  @media screen and (max-width: 1000px) {
    display: none;
  }
  &.hovered {
    width: 40px;
    height: 40px;
    top: -20px;
    left: -20px;
    border-width: 4px;
  }
  &.border__red {
    border-color: red;
  }
`;
