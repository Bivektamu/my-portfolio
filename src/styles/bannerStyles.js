import styled from "styled-components";

export const BannerSection = styled.section`
  height: calc(100vh - 105px);
  padding: 0;
  .banner-image {
    position: relative;
  }
  img {
    max-width: 100%;
    width: 600px;
  }

  @media screen and (max-width: 760px) {
    height: calc(100vh - 60px);
    img {
      max-width: 345px;
      width:80%;
      margin: auto;
      display: block;
    }
  }
`;
