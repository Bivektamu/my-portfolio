import styled from "styled-components";

export const BlobDiv = styled.div`
  width: 700px;
  height: 700px;
  background: #faf8ff;
  // border-radius: 100%;
  border-radius: 110%;

  border-width: 100px;
  border-color: #faf8ff;
  position: absolute;
  z-index: -1;
  top: calc(50vh - 350px);
  left: 45%;
  transition: all 0.6s ease;

  @media screen and (max-width: 760px) {
    width:350px;
    height:350px;
    top:calc(100vh - 400px);
    left:0;
    right:0;
    margin:auto;
  }
  &.scale {
    transform: scale(5);
    // width:200vw;
    // height:200vw;
    // top:-25%;
    // left:-25%;
  }
  &.animate {
    animation: blob 5s infinite linear;
  }
  &.stop {
    // animation:none;
    width: 250px;
    height: 250px;
    // border-radius: 71% 35% 58% 46% /  63% 43% 62% 44%;
  }

  @keyframes blob {
    0% {
      transform: rotate(1turn);
      border-radius: 110%;
    }
    25% {
      border-radius: 71% 35% 58% 46% / 63% 43% 62% 44%;
    }
    50% {
      border-radius: 48% 64% 57% 54% / 44% 42% 68% 66%;
    }

    75% {
      border-radius: 111% 113% 113% 114% / 100% 110% 130% 148%;
    }
    100% {
      border-radius: 80%;
    }
  }
`;
