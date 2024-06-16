import styled from "styled-components";

export const AboutSection = styled.section`
  img {
    width: auto;
    height: 60vh;
  }
  @media screen and (max-width: 1100px) {
    p {
      width: 100% !important;
    }

    @media screen and (max-width: 1000px) {
      .grid_6 {
        width: 100%;
      }
    }
  }
`;
