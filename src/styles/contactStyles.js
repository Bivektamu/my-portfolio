import styled from "styled-components";

export const ContactSection = styled.section`
  background-position: bottom !important;
  background-repeat: no-repeat !important;
  background-size: 100% auto;
  padding: 200px 0 100px;
  min-height: 60vh;
  @media screen and (max-width: 760px) {
    min-height: initial;
    padding: 100px 0 50px;
  }
  h2 {
    text-align: center;
    color: #24292f;
  }

  .social {
    text-align: center;
  }
  svg {
    font-size: 25px;
    margin: 4rem;
    color: #212529;
    @media screen and (max-width: 760px) {
      margin: 4rem 2rem;
    }
  }

  .fb:hover svg {
    color: #0056b3;
  }

  .gmail:hover svg {
    color: #ea4335;
  }

  .linkedin:hover svg {
    color: #0a66c2;
  }

  .github:hover svg {
    color: #2da44e;
  }
`;
