import styled, { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

export const GlobalStyles = createGlobalStyle`

${normalize}  
* {
    text-decoration: none;
    /* cursor: none; */
  }


.wow {
  visibility: hidden;
}

.wow.animated {
  animation-duration: 0.8s;
  animation-fill-mode: both;
  animation-name: fadeIn;
  visibility: visible;
}
.wow.animated.fadeInUp {
  animation-name: fadeInUp;
}

.wow.delay-1 {
  animation-delay: 0.1s;
}

.wow.delay-2 {
  animation-delay: 0.2s;
}

.wow.delay-3 {
  animation-delay: 0.3s;
}

.wow.delay-4 {
  animation-delay: 0.4s;
}




@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}



  html {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    font-size: 10px;
  }

  body {
    font-family:'Poppins';
    /* background: #fff; */
    background: ${(props) => props.theme.background};
    margin:0;
    font-weight: 400;
    font-size: 1.6rem;
    /* color:#777777; */
    color: ${(props) => props.theme.color};
    line-height: 1.4;
    overflow:hidden;
    &.loaded {
    overflow:auto;
    }
  }
  
  h1, h2, h3, h4, h5{
    font-weight: 500;
    margin: 0;
    margin-bottom: 10px;
    line-height:1.2;
    color:${(props) => props.theme.color};
  }

  .grid__4 {
    width: calc(33.33% - 20px);
    @media screen and (max-width: 1000px) {
      width: calc(50% - 20px);
  }
  }

  main {
    overflow-x:hidden;
    padding-top: 106px;
    position:relative;
  }

  section {
    display: flex;
    width: 100%;
    // min-height: calc(100vh - 106px);
    align-items: center;
    padding: 100px 0;
    
  }

  .mob {
    display:none!important;
  }

  .hvr-buzz-out:hover svg{
    animation-name: hvr-buzz-out;
    animation-duration: 0.75s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
  }

  @keyframes hvr-buzz-out {
    0% {
        transform: translateX(3px) rotate(2deg);
    }
    20% {
        transform: translateX(-3px) rotate(-2deg);
    }
    30% {
        transform: translateX(3px) rotate(2deg);
    }
    40% {
        transform: translateX(-3px) rotate(-2deg);
    }
    50% {
        transform: translateX(2px) rotate(1deg);
    }
    60% {
        transform: translateX(-2px) rotate(-1deg);
    }
    70% {
        transform: translateX(2px) rotate(1deg);
    }
    80% {
        transform: translateX(-2px) rotate(-1deg);
    }
    90% {
        transform: translateX(1px) rotate(0);
    }
    100% {
        transform: translateX(-1px) rotate(0);
    }

  }

  @media screen and (max-width: 760px) {

  section {
  padding:50px 0;
  }
    main section:not(:last-of-type)  {
      margin-bottom: 60px;
    }

    .grid__4 {
      width: 100%;
    }

    .desk {
      display:none!important
    }

    .mob {
      display: block!important
    }

    .mob#mob-tel {
      position: absolute;
      right: 50px;
      font-size: 2rem;
      color: ${(props) => props.theme.color};
      
    }

  }

`;

export const Container = styled.div`
  margin: 0 auto;
  padding: 0;
  position: relative;
  width: 1660px;
  max-width: calc(100% - 80px);

  @media screen and (max-width: 760px) {
    max-width: calc(100% - 30px);
  }

  .grid__6 {
    width: 50%;
  }

  @media screen and (max-width: 1000px) {
    .grid__6 {
      width: 100%;
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.row__reverse {
    flex-direction: row-reverse;
  }
  &.flex__wrap {
    flex-wrap: wrap;
  }

  &.align__top {
    align-items: flex-start;
  }

  @media screen and (max-width: 1000px) {
    flex-wrap: wrap;
  }

  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

export const H1 = styled.h1`
  font-size: 8rem;
  text-transform: uppercase;
  font-weight: 700;
`;

export const H2 = styled.h2`
  font-size: 4rem;
  text-transform: uppercase;
  font-weight: 700;
`;

export const H3 = styled.h3`
  font-size: 5rem;
`;

export const H4 = styled.h4`
  font-size: 2.4rem;
  text-transform: uppercase;
  font-weight: 700;
`;

export const H5 = styled.h5`
  font-size: 1.5rem;
  text-transform: uppercase;
  font-weight: 700;
`;

export const Btn = styled.div`
  padding: 15px 0;
  position: relative;
  border-radius: 4px;
  transition: all 0.3s ease;
  outline: none;
  width: 150px;
  cursor: pointer;
  background: linear-gradient(90deg, #4458dc 0%, #854fee 100%);
  background-clip: padding-box;
  box-shadow: 0px 10px 30px rgba(57, 56, 61, 0.205);
  a {
    color: #fff;
    text-transform: uppercase;
    font-size: 1.5rem;
    font-weight: 500;
    display: block;
    text-align: center;
  }
`;
